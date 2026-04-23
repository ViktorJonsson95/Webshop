export const deleteProduct = async (id) => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        throw new Error("Failed to delete product")
    }
}