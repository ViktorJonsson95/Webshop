import { useProduct } from '../hooks/useProduct';
import { useParams } from 'react-router-dom';


export default function ProductPage() {
    const { id } = useParams();
    const { data, isLoading, isError } = useProduct(id);

    if (isLoading) return <p>Loading, please wait...</p>
    //Om det blev fel ELLER om data är tom, visa felmeddelande
    if (isError || !data) return <p>Something went wrong! Couldn't find product.</p>


    return (
        <div>
            <h1>Product Page</h1>
            <h2>{data.name}</h2>
            <p>{data.price}</p>
            <p>{data.description}</p>
        </div>
    )
}
