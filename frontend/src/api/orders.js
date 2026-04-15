export const createOrder = async (order) => {
    //  const res = await fetch("http://localhost:3000/api/orders", {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(order),
    //   })

    //   if (!res.ok) {
    //     throw new Error('Failed to create order')
    //   }

    //   return res.json()

    await new Promise((res) => setTimeout(res, 500))

    return {
        id: Date.now(),
        ...order,
    }
}