<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";

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

const removeById = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/student/${id}`);
    if (response.data) {
      console.log("Đã xóa thông tin sinh viên:", response.data);
      studentList.value = studentList.value.filter(student => student.id !== id);
    }
  } catch (error) {
    console.error("Lỗi khi xóa sinh viên:", error);
  }
}

onMounted(() => {
  removeById(1);
});
</script>

<template>
</template>

<style scoped>
</style>
