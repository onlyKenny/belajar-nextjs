import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndNewClient, CityDataGridItem } from '@/functions/swagger/BelajarNextJsBackEndNew';
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

const CityTableRow: React.FC<{
    city: CityDataGridItem,
    onDeleted: () => void
}> = ({ city, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm Delete`,
            content: `Delete city ${city.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!city?.id) {
                    return;
                }

                try {
                    const client = new BelajarNextJsBackEndNewClient('http://localhost:3000/api/be');
                    await client.deleteCity(city.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                    // feedbacknya bisa pakai antd notification
                }
            },
        });
    }

    function formatDateTime() {
        const dt = city.createdAt?.toString(); // ini kan string...
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
            <td className="border px-4 py-2">{city.id}</td>
            <td className="border px-4 py-2">{city.name}</td>
            <td className="border px-4 py-2">{city.provinceName}</td>
            <td className="border px-4 py-2">{formatDateTime()}</td>
            <td className="border px-4 py-2">
                <Link href={`/city/edit/${city.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
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
    const { data, error, mutate } = useSwr<CityDataGridItem[]>('/api/be/api/Cities', swrFetcher);

    return (
        <div>
            <Title>Manage Cities</Title>
            <h2 className='mb-5 text-3xl'>Manage Cities</h2>
            <div>
                <Link href='/city/create' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
                    <FontAwesomeIcon icon={faPlus} className='mr-2'></FontAwesomeIcon>
                    Create New City
                </Link>
            </div>

            {Boolean(error) && <Alert type='error' message='Cannot get cities data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Province</th>
                        <th className='px-4 py-2'>Created At</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <CityTableRow key={i} city={x} onDeleted={() => mutate()}></CityTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
