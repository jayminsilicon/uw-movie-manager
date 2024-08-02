"use client";
import React, { useState } from "react";
import { Col, Row, Form } from "antd";
import type { FormProps, UploadFile } from "antd";
import { useRouter } from "next/navigation";
import { MovieFieldType, Notification } from "@/lib/global";
import FormComponent from "../FormComponent";

const MovieAdd: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish: FormProps<MovieFieldType>["onFinish"] = async (values) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("title", values.title);
      formData.append("publish_year", values.publish_year);
      formData.append("image", values.image);

      const res = await fetch("/api/movies", {
        method: "POST",
        body: formData,
      });
      const response = await res.json();
      if (!res.ok && response) {
        Notification.error({ message: response.message });
        return;
      }

      Notification.success({ message: response.message });
      router.push("/");
    } catch (error) {
      Notification.error({ message: "Something went wrong." });
    }
  };

  const onFinishFailed: FormProps<MovieFieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <section className="movie-section">
        <div className="container">
          <div className="page-title">
            <Row gutter={24}>
              <Col lg={24}>
                <h1>Create a new movie </h1>
              </Col>
            </Row>
          </div>
          <div className="add-movie">
            <FormComponent
              form={form}
              fileList={fileList}
              setFileList={setFileList}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default MovieAdd;
