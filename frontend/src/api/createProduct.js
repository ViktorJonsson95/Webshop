export const createProduct = async (product) => {
    const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })

    if (!res.ok) {
        throw new Error("Failed to create product")
    }

    return res.json()
}