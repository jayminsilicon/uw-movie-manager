"use client";
import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "antd";
import type { FormProps, UploadFile } from "antd";
import { useRouter } from "next/navigation";
import { MovieFieldType, Notification } from "@/lib/global";
import FormComponent from "../../FormComponent";

interface Props {
  type: string;
  id: number;
}

const MovieEdit: React.FC<Props> = (params: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [details, setDetails] = useState<any>();

  const onFinish: FormProps<MovieFieldType>["onFinish"] = async (values) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("title", values.title);
      formData.append("publish_year", values.publish_year);
      formData.append("image", values.image);

      const res = await fetch("/api/movies/" + params.id, {
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/movies/" + params.id, {
        cache: "no-store",
      });
      const response = await res.json();
      if (res.ok && response) {
        form.setFieldsValue({
          title: response.data[0].title,
          publish_year: response.data[0].publish_year,
          image: response.data[0].image,
        });

        setFileList([
          {
            uid: "-1",
            name: response.data[0].title,
            status: "done",
            url: response.data[0].image,
          },
        ]);
        setDetails(response.data[0]);
      }
    };
    params.id && fetchData();
  }, [params.id, form]);

  return (
    <>
      <section className="movie-section">
        <div className="container">
          <div className="page-title">
            <Row gutter={24}>
              <Col lg={24}>
                <h1>Edit movie {details ? details.title : ""}</h1>
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

export default MovieEdit;
