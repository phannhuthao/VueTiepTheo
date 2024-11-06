<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios"; // Import axios

interface Student {
  id: number;
  student_name: string;
}

let studentList = ref<Student[]>([]);

const getAllStudent = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/student");
    console.log("Student data:", response.data);
    studentList.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

onMounted(() => {
  getAllStudent();
});
</script>

<template>

</template>

<style scoped>
</style>
