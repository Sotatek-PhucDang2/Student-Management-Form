import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import "antd/dist/reset.css";


interface Student {
  id: string;
  name: string;
  age: number;
  address: string;
  class: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load students from localStorage
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  // Save students to localStorage
  const saveToLocalStorage = (data: Student[]) => {
    localStorage.setItem("students", JSON.stringify(data));
  };

  // Add or update student
  const handleSave = (values: Omit<Student, "id">) => {
    if (editingStudent) {
      const updatedStudents = students.map((student) =>
        student.id === editingStudent.id ? { ...student, ...values } : student
      );
      setStudents(updatedStudents);
      saveToLocalStorage(updatedStudents);
    } else {
      const id = `${values.class}_${students.length + 1}`;
      const newStudent = { ...values, id };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      saveToLocalStorage(updatedStudents);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  // Delete student
  const handleDelete = (id: string) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    saveToLocalStorage(updatedStudents);
  };

  // Search student
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open modal for editing or adding
  const openModal = (student?: Student) => {
    setEditingStudent(student || null);
    setIsModalOpen(true);
  };

  // table
  const columns: ColumnsType<Student> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Management Form</h1>

      <div style={{ marginBottom: "20px" }}>
        <Input.Search
          placeholder="Search by name or class"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px", marginRight: "20px" }}
        />
        <Button type="primary" onClick={() => openModal()}>
          Add Student
        </Button>
      </div>

      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        bordered
      />

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          initialValues={editingStudent || { name: "", age: 18, address: "", class: "" }}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please input the age!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="class"
            label="Class"
            rules={[{ required: true, message: "Please input the class!" }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
