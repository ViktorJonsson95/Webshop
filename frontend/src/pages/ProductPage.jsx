import { useProduct } from '../hooks/useProduct';
import { useParams } from 'react-router-dom';


export default function ProductPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useProduct(id);

    if (isLoading) return <p>Loading, please wait...</p>
    //Om det blev fel ELLER om data är tom, visa felmeddelande
    if (error) {
        return <p>{error?.message || "Något gick fel"}</p>
    }

    if (!data) {
        return <p>Produkten hittades inte</p>
    }


    return (
        <div className='flex flex-col justify-center'>
            <h1>Product Page</h1>
            <img
                className='w-2/4'
                src={
                    data.imageUrl && data.imageUrl.trim() !== ""
                        ? data.imageUrl
                        : "/placeholder640x640.png"
                }
                alt={data.name}></img>
            <h2>{data.name}</h2>
            <p>{data.price}</p>
            <p>{data.description}</p>
        </div>
    )
}
