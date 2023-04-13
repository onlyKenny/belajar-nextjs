import Link from 'next/link';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { BelajarNextJsBackEndNewClient, Brand } from '@/functions/swagger/BelajarNextJsBackEndNew';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { InputText } from '@/components/FormControl';
import { Spin, notification } from 'antd';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama Brand tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    name: string,
    onEdit: () => void
}> = ({ id, name, onEdit }) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: name
        }
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndNewClient('http://localhost:3000/api/be');
            await client.updateBrand(id, {
                name: data.name
            });
            reset({
                name: data.name
            });
            onEdit();
            notification.success({
                message: 'Success',
                description: 'Successfully edited province data',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='name'>Name</label>
                <InputText id='name' {...register('name')}></InputText>
                <p className='text-red-500'>{errors['name']?.message}</p>
            </div>
            <div className='mt-5'>
                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
    );
};

const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;

    const fetcher = useSwrFetcherWithAccessToken();
    const brandDetailUri = id ? `/api/be/api/Brands/${id}` : undefined;
    const { data, mutate } = useSwr<Brand>(brandDetailUri, fetcher);

    function renderForm() {
        if (!id) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        if (typeof id !== 'string') {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        const name = data?.name;
        if (!name) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        return (
            <EditForm id={id} name={name} onEdit={() => mutate()}></EditForm>
        );
    }

    return (
        <div>
            <Title>Edit Brand Data</Title>
            <Link href='/brand'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Edit Brand Data</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
