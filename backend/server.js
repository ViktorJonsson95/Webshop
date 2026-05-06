import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" with {type: "json"};

// startar firebase med credentials från service account
initializeApp({
    credential: cert(serviceAccount),
});

// hämtar firestore databasen
const db = getFirestore();

//skapar express-applikationen
const app = express();

// tillåter requests från frontend
app.use(cors());
// gör så express kan läsa json i body
app.use(express.json());

const PORT = 3000;


// skapa en produkt
// post-req till api/products
app.post("/api/products", async (req, res) => {
    try {
        //hämtar data som ska skickas från frontend
        const productData = req.body;

        //kontrollerar att name och price finns
        if (!productData.name || !productData.price) {
            return res.status(400).json({
                error: "Namn och pris på produkt är obligatoriskt!"
            });
        }

        // lägger till produkten i firestore collection
        const docref = await db.collection("products").add(productData);

        //success respons
        res.status(201).json({
            message: "produkt skapad!",
            id: docref.id,
            product: productData,
        });

    } catch (error) {
        res.status(500).json({ error: "serverfel uppstod vid tillägg av produkt." });
    }
});

//lägg till många produkter
//post-req till api/products/bulk
app.post("/api/products/bulk", async (req, res) => {
    try {
        //hämtar array från frontend
        const productsArray = req.body;

        //kollar så body är en array
        if (!Array.isArray(productsArray)) {
            return res.status(400).json({
                error: "Body måste vara en JSON-array.",
            });
        }

        // skapar en firestore batch
        const batch = db.batch();

        //loopar igenom produkter
        productsArray.forEach(product => {
            //skapar nytt dokument med id
            const docref = db.collection("products").doc();
            //lägger till produkten i batch
            batch.set(docref, product);
        });

        await batch.commit();

        res.status(201).json({
            message: `${productsArray.length} produkter tillagda!`
        });

    } catch (error) {
        res.status(500).json({ error: "serverfel uppstod vid batch" });
    }
});

//skapa order
//post-req till api/orders
app.post("/api/orders", async (req, res) => {
    try {

        //hämtar order data
        const orderData = req.body

        //kontrollerar att ordern innehåller produkter
        if (!orderData.products || orderData.products.length === 0) {
            return res.status(400).json({
                error: "Lägg till produkter för att lägga en order!"
            });
        }

        //sparar i firestore
        const docref = await db.collection("orders").add(orderData);

        res.status(201).json({
            message: "Order skapad!",
            id: docref.id,
            order: orderData
        });

    } catch (error) {
        res.status(500).json({
            error: "serverfel vid skapande av order."
        });
    }
});

//hämta alla produkter
//get-req till api/products
app.get("/api/products", async (req, res) => {
    try {

        //hämtar alla dokument från collection products
        const snapshot = await db.collection("products").get();

        //gör om dokument till array med id och data 
        const products = snapshot.docs.map((productDoc) => ({
            id: productDoc.id,
            ...productDoc.data()
        }));

        //skicka tillbaka array
        res.json(products);

    } catch (error) {
        res.status(500).json({ error: "serverfel uppstod vid hämtning av produkter" });
    }
});

//hämta en specifik produkt
//get-req med dynamiskt id
app.get("/api/products/:id", async (req, res) => {
    try {
        //hämtar dokument med id från url parametern
        const productDoc = await db
            .collection("products")
            .doc(req.params.id)
            .get();

        //om produkten inte finns
        if (!productDoc.exists) {
            return res.status(404).json({
                error: "produkten hittades inte."
            });
        }

        //skickar tillbaka produkten
        res.json({
            id: productDoc.id,
            ...productDoc.data(),
        });

    } catch (error) {
        res.status(500).json({ error: "serverfel vid hämtning av specifik produkt." })
    }
});

//hämta alla orders
app.get("/api/orders", async (req, res) => {
    try {
        //hämta alla orders
        const snapshot = await db.collection("orders").get()

        //gör om dokumenten till array
        const orders = snapshot.docs.map((orderDoc) => ({
            id: orderDoc.id,
            ...orderDoc.data()
        }));

        //skickar tillbaka orders
        res.json(orders)

    } catch (error) {
        res.status(500).json({
            error: "serverfel vid hämtning av orders"
        });
    }
});

//ta bort produkt
app.delete("/api/products/:id", async (req, res) => {
    try {
        //hämtar referens till dokument
        const docRef = db.collection("products").doc(req.params.id)
        //hämtar själva dokumentet
        const doc = await docRef.get()

        if (!doc.exists) {
            return res.status(404).json({
                error: "Produkten finns inte"
            })
        }

        //tar bort dokument
        await docRef.delete()

        res.json({
            message: "Produkt borttagen"
        })

    } catch (error) {
        res.status(500).json({
            error: "Serverfel vid borttagning"
        })
    }
})

//uppdatera produkt med id
app.put("/api/products/:id", async (req, res) => {
    try {
        //hämtar dokumentreferens
        const docRef = db.collection("products").doc(req.params.id);
        //hämtar dokumentet
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                error: "Produkten finns inte",
            });
        }

        //uppdaterar dokumentet med data från frontend
        await docRef.update(req.body);

        res.json({
            message: "Produkt uppdaterad",
        });
    } catch {
        res.status(500).json({
            error: "Serverfel vid uppdatering",
        });
    }
});

//ta bort order
app.delete("/api/orders/:id", async (req, res) => {
    try {
        //hämtar dokument referens
        const docRef = db.collection("orders").doc(req.params.id)
        //hämtar dokumentet
        const doc = await docRef.get()

        if (!doc.exists) {
            return res.status(404).json({
                error: "Ordern finns inte",
            })
        }

        //tar bort ordern
        await docRef.delete()

        res.json({
            message: "Order borttagen",
        })
    } catch (error) {
        res.status(500).json({
            error: "Serverfel vid borttagning av order",
        })
    }
})
//starta servern på vald PORT
app.listen(PORT, () => {
    console.log("server körs på http://localhost:3000")
});