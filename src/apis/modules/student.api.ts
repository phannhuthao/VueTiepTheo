import axios from 'axios'

export  interface  Student {
    id: number;
    student_name: string;
    email: string;
    address: string;
    phone: string;
    status: boolean;
    created_at: string;
}


export const studentApi = {
    findAll: async () => {
        return await axios.get("http://localhost:3000/api/student")
    }
}
