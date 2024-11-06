<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

interface Student {
  id: number;
  student_name: string;
  email: string;
  address: string;
  phone: string;
  status: boolean;
  created_at: string;
}

let studentList = ref<Student[]>([]);

const getStudentById = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/student/${id}`);
    if (response.data) {
      console.log("Thông tin chi tiết của sinh viên:", response.data);
      studentList.value = [response.data];
    }
  } catch (error) {
    console.error("Không tìm thấy bản ghi", error);
  }
};

onMounted( () => {
  getStudentById(1);
})
</script>

<template>
</template>

<style scoped>
</style>
