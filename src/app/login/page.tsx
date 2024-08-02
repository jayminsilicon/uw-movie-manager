"use client"
import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { Typography } from 'antd';
import { Notification } from '@/lib/global';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const Login: React.FC = () => {
    const router = useRouter()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const res = await signIn("credentials",{
                ...values,
                redirect: false,
            })
    
            if (res?.error) {
                Notification.error({message: "Invalid credential."})
                return
            }
            Notification.success({message: "Login Successful."})
            router.push("/")
        } catch (error) {
            Notification.error({message: "Something went wrong."})
        }
    };
    
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <section className='login'>
                <div className='container'>
                    <h1>Sign in</h1>
                    <Form
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ type: 'email', required: true, message: 'Please Enter Email Address!' }]}>
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder='Password' />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </>
    )
};

export default Login;