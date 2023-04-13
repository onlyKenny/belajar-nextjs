import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndNewClient, ProductDataGridItem } from '@/functions/swagger/BelajarNextJsBackEndNew';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Modal } from 'antd';
import { format, parseISO } from 'date-fns';
import { id as indonesianTime } from 'date-fns/locale';
import Link from 'next/link';
import useSwr from 'swr';

// C- Create
// R- Read
// U- Update
// D- Delete

const ProductTableRow: React.FC<{
    product: ProductDataGridItem,
    onDeleted: () => void
}> = ({ product, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm Delete`,
            content: `Delete product ${product.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!product?.id) {
                    return;
                }

                try {
                    const client = new BelajarNextJsBackEndNewClient('http://localhost:3000/api/be');
                    await client.deleteProduct(product.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                    // feedbacknya bisa pakai antd notification
                }
            },
        });
    }

    function formatDateTime() {
        const dt = product.createdAt?.toString();
        if (!dt) {
            return;
        }

        const isoDate = parseISO(dt);
        return format(isoDate, 'd MMM yyy HH:mm:ss', {
            locale: indonesianTime
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{product.id}</td>
            <td className="border px-4 py-2">{product.name}</td>
            <td className="border px-4 py-2">{product.brandName}</td>
            <td className="border px-4 py-2">{product.description}</td>
            <td className="border px-4 py-2">{product.price}</td>
            <td className="border px-4 py-2">{product.quantity}</td>
            <td className="border px-4 py-2">{formatDateTime()}</td>
            <td className="border px-4 py-2">
                <Link href={`/product/edit/${product.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faEdit}></FontAwesomeIcon>
                    Edit
                </Link>
                <button onClick={onClickDelete} className="ml-1 py-1 px-2 text-xs bg-red-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faRemove}></FontAwesomeIcon>
                    Delete
                </button>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error, mutate } = useSwr<ProductDataGridItem[]>('/api/be/api/Products', swrFetcher);

    return (
        <div>
            <Title>Manage Products</Title>
            <h2 className='mb-5 text-3xl'>Manage Products</h2>
            <div>
                <Link href='/product/create' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
                    <FontAwesomeIcon icon={faPlus} className='mr-2'></FontAwesomeIcon>
                    Create New Product
                </Link>
            </div>

            {Boolean(error) && <Alert type='error' message='Cannot get products data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Brand Name</th>
                        <th className='px-4 py-2'>Description</th>
                        <th className='px-4 py-2'>Price</th>
                        <th className='px-4 py-2'>Quantity</th>
                        <th className='px-4 py-2'>Created At</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <ProductTableRow key={i} product={x} onDeleted={() => mutate()}></ProductTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
