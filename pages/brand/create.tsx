import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndNewClient } from '@/functions/swagger/BelajarNextJsBackEndNew';
import Link from 'next/link';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama Brand tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        // console.log(data);

        try {
            const client = new BelajarNextJsBackEndNewClient('http://localhost:3000/api/be');
            await client.createBrand({
                name: data.name
            });
            reset();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Title>Create New brand</Title>
            <Link href='/brand'>Return to Index</Link>
            
            <h2 className='mb-5 text-3xl'>Create New Brand</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='name' {...register('name')}></input>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
