"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Pagination,
  PaginationProps,
  Row,
  Typography,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { PlusCircleOutlined } from "@ant-design/icons";
import LogoutIcon from "../../public/assets/images/logout.svg";
import { signOut } from "next-auth/react";

const MovieList: React.FC = () => {
  const [movieDataList, setMovieDataList] = useState({ count: 0, rows: [] });

  const fetchData = async (page = 1) => {
    const res = await fetch("/api/movies?page=" + (page - 1), {
      cache: "no-store",
    });
    const user = await res.json();
    if (res.ok && user) {
      setMovieDataList(user.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a>Prev</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const onChange = (page: number) => {
    fetchData(page);
  };
  return (
    <>
      {movieDataList.rows.length === 0 && (
        <section className="movie-list">
          <div className="container">
            <div className="page-title">
              <Row gutter={24}>
                <Col lg={24}>
                  <h1>Your movie list is empty </h1>
                  <div className="btn">
                    <Link href={"/movie/add"} title="My movies">
                      Add a new movie
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </section>
      )}

      {movieDataList.rows.length >= 0 && (
        <section className="movie-section">
          <div className="container">
            <div className="page-title">
              <Row gutter={24}>
                <Col xs={16} lg={12}>
                  <h1>
                    My movies{" "}
                    <Link href={"/movie/add"} title="My movies">
                      <PlusCircleOutlined />
                    </Link>{" "}
                  </h1>
                </Col>
                <Col xs={8} lg={12} className="aline-right">
                  <Button
                    type="link"
                    htmlType="button"
                    onClick={() => signOut()}
                  >
                    Logout{" "}
                    <Image
                      src={LogoutIcon}
                      alt={"Logout"}
                      width={24}
                      height={24}
                    />
                  </Button>
                </Col>
              </Row>
            </div>
            <Row gutter={24} className="movie-listing">
              {movieDataList.rows?.map((item: any, index: number) => (
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  className="movie-item"
                  key={`movie-list-${index}`}
                >
                  <Link href={"/movie/edit/"+item.id}>
                    <Image
                      src={"/assets/images/movie01.jpg"}
                      alt={item.title}
                      width={270}
                      height={400}
                    />
                    <div className="caption">
                      <h4>{item.title}</h4>
                      <span>{item.publish_year}</span>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
            <Pagination
              total={movieDataList.count ?? 0}
              itemRender={itemRender}
              defaultPageSize={8}
              onChange={onChange}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default MovieList;
