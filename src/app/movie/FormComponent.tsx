import { MovieFieldType, onPreview } from "@/lib/global";
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Row,
  Upload,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile } from "antd/es/upload";
import Image from "next/image";
import React from "react";
import UploadIcon from "../../../public/assets/images/upload-icon.svg";
import { useRouter } from "next/navigation";

interface Props {
  form: FormInstance;
  onFinish: (values: MovieFieldType) => void;
  onFinishFailed: (values: any) => void;
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
};

const FormComponent = ({
  form,
  onFinish,
  onFinishFailed,
  fileList,
  setFileList,
}: Props) => {
  const router = useRouter()
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const getValueFromEvent = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Row gutter={110}>
        <Col xs={24} md={12} lg={11}>
          <Form.Item
            name="image"
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true }]}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                onChange={onChange}
                onPreview={onPreview}
                fileList={fileList}
                beforeUpload={(file: RcFile) => {
                  const isJpgOrPng =
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg" ||
                    file.type === "image/png";
                  const isLt1M = file.size / 1024 / 1024 < 9;

                  if (!isJpgOrPng) {
                    message.error(
                      `Upload valid image. Only JPG, JPEG or PNG are allowed.`
                    );
                    return Upload.LIST_IGNORE;
                  } else if (!isLt1M) {
                    message.error("File size should not be more than 9 MB");
                    return Upload.LIST_IGNORE;
                  } else {
                    form.setFieldsValue({ image: file });
                    return false;
                  }
                }}
                maxCount={1}
                name="image"
                accept="image/*"
              >
                {fileList.length < 1 && (
                  <div>
                    <Image
                      src={UploadIcon}
                      alt={"Upload"}
                      width={16}
                      height={16}
                    />{" "}
                    Drop an image here
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item className="btn-wrap mobile-only">
            <Button type="dashed" htmlType="button" onClick={()=> router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={13}>
        <div className="mt-15">
          <Form.Item
            name="title"
            rules={[{ required: true }]}
            style={{ maxWidth: 360 }}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            name="publish_year"
            rules={[{ required: true }]}
            style={{ maxWidth: 215 }}
          >
            <InputNumber placeholder="Publishing year" />
          </Form.Item>

          <Form.Item className="btn-wrap">
            <Button type="dashed" htmlType="button" onClick={()=> router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default FormComponent;
