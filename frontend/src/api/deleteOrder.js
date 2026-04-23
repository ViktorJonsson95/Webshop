export const deleteOrder = async (id) => {
    const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        throw new Error("Failed to delete order")
    }
}