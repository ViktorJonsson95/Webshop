import { useEffect, useState } from "react";
import {useCreateOrder} from "../hooks/useCreateOrder"


export default function CheckoutPage() {
    const {mutate, isLoading, isError} = useCreateOrder();

    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email:"",
        address:""
    })

    // Hämta cart + fixa quantity
    useEffect(() => {
        const rawCart = JSON.parse(localStorage.getItem("cart")) || []

        const grouped = Object.values(
            rawCart.reduce((acc, item) => {
                if(!acc[item.id]) {
                    acc[item.id] = {...item, quantity:1}
                } else {
                    acc[item.id].quantity += 1
                }
                return acc
            }, {})
        )

        setCartItems(grouped)
    }, [])

    // Total i checkout
    const total = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)

    // Skicka order
    const handleOrder = () => {
        if(!form.name || !form.email || !form.address) {
            alert("Fyll i alla fält!")
            return
        }

        const order = {
            customer: form,
            items: cartItems,
            total: total
        }

        mutate(order, {
            onSuccess: () => {
                localStorage.removeItem("cart")
                alert("Beställning skickad!") // TEMPORÄR - ska byta sida senare?
            },
            onError: () => {
                alert("Något gick fel..")
            }
        })
    }


    return (
        <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2">
                <section>
                    <h1>Orderöversikt</h1>

                    {cartItems.length === 0 ? (
                        <p>Din kundvagn är tom</p>
                    ) : (
                        <div className="flex flex-col gap-4 text-left">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex flex-col border-1 border-black p-3">
                                 <p>{item.name}</p>
                                 <p className="flex justify-between">
                                    <span>
                                        {item.quantity}st
                                    </span> 
                                    <span>
                                        {item.price}:-
                                    </span>
                                 </p>
                                </div>
                            ))}

                            <h2>Total: {total} :-</h2>
                        </div>
                    )}
                </section>

                <section className="flex flex-col gap-5 border-2 border-blue-500 p-4 rounded">
                    <h2>Dina uppgifter</h2>
                    
                    <input 
                        type="text"
                        placeholder="NAMN:"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />

                    <input 
                        type="text"
                        placeholder="E-MAIL:"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />

                    <input 
                        type="text"
                        placeholder="ADDRESS:"
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                </section>
            </div>
            

            <button 
                onClick={handleOrder} 
                disabled={isLoading}
                className="bg-blue-400 text-white px-8 py-3 font-semibold"
            >
                {isLoading ? "Skickar order..." : `Slutför order på ${total} kr`}
            </button>

            {isError && <p>Något gick fel!</p>}
        </div>
    )
}