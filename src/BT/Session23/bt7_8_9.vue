<script setup lang="ts">
import { onMounted, ref } from "vue";
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
let showAddForm = ref(false);
let showDeleteConfirm = ref(false);
let studentToDelete = ref<number | null>(null);

let newStudent = ref({
  student_name: "",
  email: "",
  address: "",
  phone: "",
});

let errors = ref({
  student_name: "",
  email: "",
  phone: "",
});

const getAllStudent = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/student");
    studentList.value = response.data;
  } catch (error) {
    console.error("Lỗi không hiển thị thông tin sinh viên:", error);
  }
};

const addStudent = async () => {
  if (!validateForm()) return;

  try {
    const response = await axios.post("http://localhost:3000/api/student", newStudent.value);
    studentList.value = response.data;
    closeAddForm();
  } catch (error) {
    console.error("Lỗi không thêm được sinh viên", error);
  }
};

const validateForm = () => {
  errors.value = {
    student_name: "",
    email: "",
    phone: "",
  };

  let isValid = true;

  if (!newStudent.value.student_name) {
    errors.value.student_name = "Tên sinh viên không được để trống.";
    isValid = false;
  }

  if (!newStudent.value.email) {
    errors.value.email = "Email không được để trống.";
    isValid = false;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newStudent.value.email)) {
    errors.value.email = "Email không đúng định dạng.";
    isValid = false;
  }

  if (!/^\d+$/.test(newStudent.value.phone)) {
    errors.value.phone = "Số điện thoại chỉ được phép nhập số.";
    isValid = false;
  }

  return isValid;
};

const deleteById = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/student/${id}`);
    console.log("Xóa sinh viên thành công", response.data);
    studentList.value = response.data;
    closeDeleteConfirm();
  } catch (error) {
    console.error("Lỗi không xóa được sinh viên", error);
  }
};

const closeAddForm = () => {
  showAddForm.value = false;
  newStudent.value = { student_name: "", email: "", address: "", phone: "" };
};

const confirmDelete = (id: number) => {
  studentToDelete.value = id;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  studentToDelete.value = null;
};

onMounted(() => {
  getAllStudent();
});
</script>

<template>
  <div class="container">
    <h1>Quản Lí Sinh Viên</h1>
    <button class="btnAdd" @click="showAddForm = true">Thêm mới sinh viên</button>
  </div>

  <table class="table">
    <thead>
    <tr>
      <th><input type="checkbox"></th>
      <th>Tên Sinh Viên</th>
      <th>Email</th>
      <th>Địa Chỉ</th>
      <th>Số Điện Thoại</th>
      <th colspan="2">Lựa Chọn</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="student in studentList" :key="student.id">
      <td><input type="checkbox"></td>
      <td>{{ student.student_name }}</td>
      <td>{{ student.email }}</td>
      <td>{{ student.address }}</td>
      <td>{{ student.phone }}</td>
      <td>
        <button class="btnDelete" @click="confirmDelete(student.id)">Xóa</button>
        <button class="btnEdit">Sửa</button>
      </td>
    </tr>
    </tbody>
  </table>

  <!-- Modal Thêm Sinh Viên -->
  <div v-if="showAddForm" class="add-student-modal-overlay">
    <div class="add-student-modal">
      <h2>Thêm mới sinh viên</h2>
      <form class="form-add">
        <div>
          <label>Tên sinh viên</label>
          <input type="text" v-model="newStudent.student_name" />
          <span class="error">{{ errors.student_name }}</span>
        </div>

        <div>
          <label>Email</label>
          <input type="text" v-model="newStudent.email" />
          <span class="error">{{ errors.email }}</span>
        </div>

        <div>
          <label>Địa chỉ</label>
          <input type="text" v-model="newStudent.address" />
        </div>

        <div>
          <label>Số điện thoại</label>
          <input type="text" v-model="newStudent.phone" />
          <span class="error">{{ errors.phone }}</span>
        </div>
      </form>

      <div>
        <button @click="closeAddForm">Cancel</button>
        <button @click="addStudent">Add</button>
      </div>
    </div>
  </div>

  <!--  Modal Xóa Sinh Viên -->
  <div v-if="showDeleteConfirm" class="delete-confirm-modal-overlay">
    <div class="delete-confirm-modal">
      <h2>Xóa Nhân Viên</h2>
      <p>Bạn chắc chắn xóa sinh viên này ?</p>
      <button @click="closeDeleteConfirm">Hủy</button>
      <button @click="deleteById">Xóa</button>
    </div>
  </div>
</template>

<style scoped>
.delete-confirm-modal-overlay, .add-student-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-student-modal, .delete-confirm-modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.container {
  background-color: #3b82f6;
  width: 100%;
  height: 100%;
}

.table {
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.btnEdit {
  background-color: orange;
  color: white;
  border: none;
}

.btnDelete {
  background-color: red;
  color: white;
  border: none;
}

.btnEdit,
.btnDelete {
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}


.btnAdd {
  background-color: green;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  height: 35px;
  width: 150px;
}

.error {
  color: red;
  font-size: 0.9em;
}

/* Modal overlay to center form */
.add-student-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-student-modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.form-add div {
  margin-bottom: 10px;
}
</style>
