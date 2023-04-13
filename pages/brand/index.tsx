import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndNewClient, Brand } from '@/functions/swagger/BelajarNextJsBackEndNew';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Modal } from 'antd';
import Link from 'next/link';
import useSwr from 'swr';

// C- Create
// R- Read
// U- Update
// D- Delete

const BrandTableRow: React.FC<{
    brand: Brand,
    onDeleted: () => void
}> = ({ brand, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm Delete`,
            content: `Delete Brand ${brand.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!brand?.id) {
                    return;
                }

                try {
                    const client = new BelajarNextJsBackEndNewClient('http://localhost:3000/api/be');
                    await client.deleteBrand(brand.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                    // feedbacknya bisa pakai antd notification
                }
            },
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{brand.id}</td>
            <td className="border px-4 py-2">{brand.name}</td>
            <td className="border px-4 py-2">{brand.createdAt?.toLocaleString()}</td>
            <td className="border px-4 py-2">
                <Link href={`/brand/edit/${brand.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
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
    const { data, error, mutate } = useSwr<Brand[]>('/api/be/api/Brands', swrFetcher);

    return (
        <div>
            <Title>Manage Brand</Title>
            <h2 className='mb-5 text-3xl'>Manage Brand</h2>
            <div>
                <Link href='/brand/create' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
                    <FontAwesomeIcon icon={faPlus} className='mr-2'></FontAwesomeIcon>
                    Create new Brand
                </Link>
            </div>

            {Boolean(error) && <Alert type='error' message='Cannot get Brand data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Created At</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <BrandTableRow key={i} brand={x} onDeleted={() => mutate()}></BrandTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
