const mockProducts = [
    { id: 1, name: 'Produkt 1', price: 100 },
    { id: 2, name: 'Produkt 2', price: 200 },
    { id: 3, name: 'Produkt 3', price: 300 },
]

export const getProducts = async () => {
    // const res = await fetch('http://localhost:3000/api/products')

    // if (!res.ok) {
    //     throw new Error('Failed to fetch products')
    // }

    // return res.json()

    await new Promise((res) => setTimeout(res, 500))

    return mockProducts
}