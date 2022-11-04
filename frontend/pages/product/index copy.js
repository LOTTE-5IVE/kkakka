import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Title from "../../components/common/Title";
import Sidebar from "../../components/product/Sidebar";
import ProductRecCard from "../../components/product/ProductRecCard";
import Pagination from "../../components/product/Pagination";
import axios from "axios";

export default function ProductList() {
  const cat_name = {
    0: "전체 상품",
    1: "비스킷/샌드",
    2: "스낵/봉지과자",
    3: "박스과자",
    4: "캔디/사탕/젤리",
    5: "시리얼/바",
    6: "초콜릿",
    7: "껌/자일리톨",
    8: "선물세트",
  };

  const router = useRouter();
  const cat_id = router.query.cat_id;
  const search = router.query.search;

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [data, setData] = useState();

  const getProduct = async () => {
    await axios
      .get(`/api/products?category=${cat_id}&page=${page}`)
      .then((res) => {
        setData(res);
        setPage(res.data.pageInfo.currentPage);
        setLastPage(res.data.pageInfo.lastPage);
      });
  };

  const getProductc = async () => {
    await axios.get(`/api/products?category=${cat_id}&page=1`).then((res) => {
      setData(res);
      setPage(res.data.pageInfo.currentPage);
      setLastPage(res.data.pageInfo.lastPage);
    });
  };

  useEffect(() => {
    getProduct();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getProductc();
  }, [cat_id]);

  return (
    <>
      <Title title="상품목록" />
      <div className="ProductLContents">
        <div className="sidebar">
          <Sidebar menu={cat_id} />
        </div>

        <div className="productWrapper">
          <div className="title">
            {search ? (
              <div className="searchBar">
                <img src="/product/mg.png" />
                <p>
                  <input type="text" size="12" value={search} />
                </p>
              </div>
            ) : (
              <p className="category">{cat_name[cat_id]}</p>
            )}
          </div>
          <ul className="productList">
            {data?.data.data?.map((product) => {
              return (
                <li className="productInner" key={product.id}>
                  <div className="productBox">
                    <ProductRecCard
                      id={product.id}
                      imgsrc={product.image_url}
                      name={product.name}
                      price={product.price}
                      discount={product.discount}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="pagination">
            <Pagination page={page} setPage={setPage} lastPage={lastPage} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media screen and (min-width: 769px) {
          /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */
          .ProductLContents {
            margin: 57px auto 0;
            width: 1330px;
            height: 1786px;
            display: flex;

            .sidebar {
              display: inline-block;
              width: 236px;
              margin-right: 67px;
            }

            .productWrapper {
              width: 1072px;

              .title {
                padding-left: 60px;

                img {
                  width: 50px;
                }

                .category {
                  font-size: 24px;
                  font-weight: 700;
                }
              }

              .searchBar {
                width: 100%;
                display: flex;
                align-items: flex-start;

                p {
                  width: 30%;
                  margin-left: 3%;
                  padding-left: 3%;
                  line-height: 35px;
                  border-bottom: 3px solid red;

                  input[type="text"] {
                    border: 0;
                    font-size: 17px;
                    font-weight: 600;
                  }

                  input[type="text"]:focus {
                    outline: none;
                  }
                }
              }

              .productList {
                display: table;
                width: 1035px;
                height: 1566px;

                .productInner {
                  display: inline-block;
                  width: 33.3%;
                  margin-bottom: 69px;

                  .productBox {
                    width: 298px;
                    margin: 0 auto;
                  }
                }
              }
            }
          }
        }

        @media screen and (max-width: 768px) {
          /* 태블릿에 사용될 스트일 시트를 여기에 작성합니다. */
          .ProductLContents {
            margin: 28.5px auto 0;
            width: 80vw;
            height: 120vw;
            display: flex;

            .sidebar {
              display: inline-block;
              width: 12.42vw;
              margin-right: 3.53vw;
            }

            .productWrapper {
              width: 62vw;

              .title {
                padding-left: 8vw;

                img {
                  width: 2.63vw;
                }

                .category {
                  font-size: 1.26vw;
                  font-weight: 700;
                }
              }

              .searchBar {
                width: 100%;
                display: flex;
                align-items: center;

                p {
                  width: 30%;
                  margin-left: 3%;
                  padding-left: 3%;
                  line-height: 1.84vw;
                  border-bottom: 0.16vw solid red;

                  input[type="text"] {
                    border: 0;
                    font-size: 0.89vw;
                    font-weight: 600;
                  }

                  input[type="text"]:focus {
                    outline: none;
                  }
                }
              }

              .productList {
                display: table;
                width: 60vw;
                height: 82.42vw;

                .productInner {
                  display: inline-block;
                  width: 33.3%;
                  margin-bottom: 3vw;

                  .productBox {
                    width: 15.68vw;
                    margin: 0 auto;
                  }
                }
              }
            }
          }
        }

        @media screen and (max-width: 480px) {
          /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */
          .ProductLContents {
            margin: 0;
            width: 480px;
            height: 910px;
            display: flex;

            .sidebar {
              display: none;
            }

            .productWrapper {
              width: 480px;

              .title {
                img {
                  width: 50px;
                }

                .category {
                  font-size: 24px;
                  font-weight: 700;
                }
              }

              .searchBar {
                width: 100%;
                display: flex;
                align-items: center;

                p {
                  width: 30%;
                  margin-left: 3%;
                  padding-left: 3%;
                  line-height: 35px;
                  border-bottom: 3px solid red;

                  input[type="text"] {
                    border: 0;
                    font-size: 17px;
                    font-weight: 600;
                  }

                  input[type="text"]:focus {
                    outline: none;
                  }
                }
              }

              .productList {
                display: table;
                width: 480px;
                height: 750px;
                padding: 0;

                .productInner {
                  display: inline-block;
                  width: 33.3%;
                  margin-bottom: 20px;

                  .productBox {
                    width: 150px;
                    margin: 0 auto;
                  }
                }
              }

              .pagination {
                width: 480px;
              }
            }
          }
        }
      `}</style>
    </>
  );
}