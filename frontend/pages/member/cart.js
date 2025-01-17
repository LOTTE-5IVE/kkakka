import Image from "next/image";
import { router } from "next/router";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { DeleteHApi, GetHApi, PostHApi } from "../../apis/Apis";
import { AdminButton } from "../../components/common/Button/AdminButton";
import ButtonComp from "../../components/common/Button/ButtonComp";
import Title from "../../components/common/Title";
import { CouponCartApply } from "../../components/coupon/CouponCartApply";
import { CouponCartModal } from "../../components/coupon/CouponCartModal";
import { CartCntContext } from "../../context/CartCntContext";
import { PaymentContext } from "../../context/PaymentContext";
import { commaMoney } from "../../hooks/commaMoney";
import { getToken } from "../../hooks/getToken";
import { isNumber } from "../../hooks/isNumber";
import { NGray } from "../../typings/NormalColor";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [checkItemsIdx, setCheckItemsIdx] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [totalUnValid, setTotalUnValid] = useState(true);
  const [selectUnValid, setSelectUnValid] = useState(true);
  const [token, setToken] = useState("");
  const { cartCnt, setCartCnt } = useContext(CartCntContext);
  const { payment, setPayment } = useContext(PaymentContext);
  const [modalVisibleId, setModalVisibleId] = useState("");

  const onModalHandler = (id) => {
    setModalVisibleId(id);
  };

  const selectQuery = () => {
    setPayment(checkItems);
    router.push({
      pathname: `/payment`,
    });
  };

  const selectAllQuery = () => {
    setPayment(cartItems);
    router.push({
      pathname: `/payment`,
    });
  };

  const handleSingleCheck = (checked, product) => {
    if (checked) {
      setCheckItems((prev) => [...prev, product]);
      setCheckItemsIdx((prev) => [...prev, product.cartItemId]);
    } else {
      setCheckItems(
        checkItems.filter((el) => el.cartItemId !== product.cartItemId)
      );
      setCheckItemsIdx(checkItemsIdx.filter((el) => el !== product.cartItemId));
    }
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = [];
      const itemArry = [];
      cartItems.forEach((el) => {
        idArray.push(el.cartItemId);
        itemArry.push(el);
      });

      setCheckItems(itemArry);
      setCheckItemsIdx(idArray);
    } else {
      setCheckItems([]);
      setCheckItemsIdx([]);
    }
  };

  const handlePlus = (id) => {
    setCartItems(
      cartItems.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleMinus = (id) => {
    setCartItems(
      cartItems.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((product) =>
        product.id === id ? { ...product, quantity: quantity } : product
      )
    );
  };

  const chkMinOrd = (product, coupon, quantityNum) => {
    let quantity = quantityNum || product.quantity - 1;

    if (
      !coupon ||
      product.price * (1 - 0.01 * product.discount) * quantity >
        coupon.minOrderPrice
    ) {
      return true;
    }

    return false;
  };

  const getCartItem = async () => {
    GetHApi("/api/carts", token).then((res) => {
      setCartItems(res.cartItems);
      setPayment(res.cartItems);

      setTotalPrice(
        res.cartItems.reduce((prev, cur) => prev + cur.price * cur.quantity, 0)
      );
      setDiscountPrice(
        res.cartItems.reduce((prev, cur) => {
          if (cur.couponDto) {
            return prev + Math.floor(cur.totalDiscount);
          } else {
            return (
              prev + Math.floor(cur.price * 0.01 * cur.discount * cur.quantity)
            );
          }
        }, 0)
      );
    });
  };

  const editCartItem = async (id, quantity) => {
    if (quantity > 0) {
      PostHApi("/api/carts", { productId: id, quantity: quantity }, token).then(
        (res) => {
          getCartItem();
        }
      );
    }
  };

  const removeCartItem = async (id) => {
    DeleteHApi(`/api/carts/${id}`, token).then((res) => {
      getCartItem();
      getCartCount();
    });
  };

  const getCartCount = async () => {
    await GetHApi("/api/members/me/carts/all", token).then((res) => {
      setCartCnt(res.cartCount);
    });
  };

  const cancelCoupon = async (cartItemId, couponId) => {
    await DeleteHApi(`/api/carts/${cartItemId}/${couponId}`, token).then(
      (res) => {
        getCartItem();
      }
    );
  };

  useEffect(() => {
    setToken(getToken());
    if (token !== "") {
      getCartItem();

      setDiscountPrice(
        checkItems.reduce((prev, cur) => {
          if (cur.couponDto) {
            return prev + Math.floor(cur.totalDiscount);
          } else {
            return (
              prev + Math.floor(cur.price * 0.01 * cur.discount * cur.quantity)
            );
          }
        }, 0)
      );
    }
  }, [token, modalVisibleId]);

  useEffect(() => {
    if (checkItems.length > 0) {
      setSelectUnValid(false);
      setTotalPrice(
        checkItems.reduce((prev, cur) => prev + cur.price * cur.quantity, 0)
      );
      setDiscountPrice(
        checkItems.reduce((prev, cur) => {
          if (cur.couponDto) {
            return prev + Math.floor(cur.totalDiscount);
          } else {
            return (
              prev + Math.floor(cur.price * 0.01 * cur.discount * cur.quantity)
            );
          }
        }, 0)
      );

      return;
    } else {
      setSelectUnValid(true);

      setTotalPrice(
        cartItems.reduce((prev, cur) => prev + cur.price * cur.quantity, 0)
      );
      setDiscountPrice(
        cartItems.reduce((prev, cur) => {
          if (cur.couponDto) {
            return prev + Math.floor(cur.totalDiscount);
          } else {
            return (
              prev + Math.floor(cur.price * 0.01 * cur.discount * cur.quantity)
            );
          }
        }, 0)
      );
    }
  }, [checkItems]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setTotalUnValid(false);
      return;
    } else {
      setTotalUnValid(true);
    }
  }, [cartItems]);

  return (
    <>
      <Title title="장바구니" />
      <div className="CartTitle">
        <h2>장바구니</h2>
      </div>
      <div className="CartContents">
        <div className="orderTables">
          <div className="orderList">
            <table>
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "40%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "5%" }} />
              </colgroup>
              <thead>
                <tr style={{ height: "57px" }}>
                  <th scope="col">
                    {cartItems ? (
                      <input
                        type="checkbox"
                        name="select-all"
                        onChange={(e) => handleAllCheck(e.target.checked)}
                        checked={
                          checkItemsIdx.length === cartItems.length
                            ? true
                            : false
                        }
                      />
                    ) : (
                      <input type="checkbox" checked={false} />
                    )}
                  </th>
                  <th scope="col">이미지</th>
                  <th scope="col">상품정보</th>
                  <th scope="col">수량</th>
                  <th scope="col">배송비</th>
                  <th scope="col">합계</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div
                        className="cartEmptyImg"
                        style={{ position: "relative" }}
                      >
                        <Image src="/member/no_item.gif" alt="" layout="fill" />
                      </div>

                      <p className="cartEmptyComment">
                        장바구니가 비어 있습니다.
                      </p>
                    </td>
                  </tr>
                )}

                {cartItems?.map((product) => {
                  return (
                    <tr key={product.cartItemId}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleSingleCheck(e.target.checked, product)
                          }
                          checked={
                            checkItemsIdx.includes(product.cartItemId)
                              ? true
                              : false
                          }
                        />
                      </td>
                      <td>
                        <div
                          className="thumnail"
                          style={{ position: "relative", margin: "auto" }}
                        >
                          <Image src={product.imageUrl} alt="" layout="fill" />
                        </div>
                      </td>
                      <td>
                        <div>{product.name}</div>
                        <div className="couponWrapper">
                          <div className="couponContents">
                            {product.couponDto ? (
                              <input
                                key={product.cartItemId}
                                type="text"
                                size="7"
                                value={product.couponDto.name}
                                readOnly
                              />
                            ) : (
                              <input
                                type="text"
                                size="7"
                                defaultValue=""
                                readOnly
                              />
                            )}
                          </div>
                          <div style={{ display: "flex" }}>
                            {product.couponDto ? (
                              <>
                                <div
                                  onClick={() => {
                                    onModalHandler(product.id);
                                  }}
                                >
                                  <AdminButton
                                    context="쿠폰변경"
                                    color="#05c7f2"
                                    width="60px"
                                  />
                                </div>
                                <div
                                  onClick={() => {
                                    cancelCoupon(
                                      product.cartItemId,
                                      product.couponDto.id
                                    );
                                  }}
                                >
                                  <AdminButton
                                    context="적용취소"
                                    color="red"
                                    width="60px"
                                  />
                                </div>
                              </>
                            ) : (
                              <div
                                onClick={() => {
                                  onModalHandler(product.id);
                                }}
                              >
                                <AdminButton
                                  context="쿠폰적용"
                                  color="#05c7f2"
                                  width="60px"
                                />
                              </div>
                            )}

                            {product.id === modalVisibleId ? (
                              <CouponCartModal>
                                <div>
                                  <CouponCartApply
                                    id={product.id}
                                    modalVisibleId={modalVisibleId}
                                    setModalVisibleId={setModalVisibleId}
                                    cartItemId={product.cartItemId}
                                    product={product}
                                  />
                                </div>
                              </CouponCartModal>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>
                          <input
                            className="minusBtn"
                            type="button"
                            onClick={() => {
                              editCartItem(product.id, product.quantity - 1);
                              handleMinus(product.id);
                            }}
                            value="-"
                            disabled={
                              !chkMinOrd(product, product.couponDto, null)
                            }
                          />

                          <input
                            type="text"
                            onChange={(e) => {
                              if (!isNumber(e.target.value)) {
                                alert("숫자만 입력하세요.");
                                handleQuantity(product.id, product.quantity);
                                return;
                              }

                              if (Number(e.target.value) > product.stock) {
                                alert("수량 한도를 초과했습니다.");
                              } else if (
                                chkMinOrd(
                                  product,
                                  product.couponDto,
                                  Number(e.target.value)
                                )
                              ) {
                                handleQuantity(product.id, e.target.value);
                                editCartItem(product.id, e.target.value);
                              } else {
                                alert("최소 주문금액 이하입니다.");
                              }
                            }}
                            onBlur={(e) => {
                              if (Number(e.target.value) < 1) {
                                alert("최소 수량은 1개입니다.");
                                handleQuantity(product.id, 1);
                                editCartItem(product.id, 1);
                              }
                            }}
                            size="1"
                            value={product.quantity}
                            style={{ textAlign: "center" }}
                            disabled={!chkMinOrd(product, product.couponDto)}
                          />
                          <input
                            className="plusBtn"
                            type="button"
                            onClick={() => {
                              editCartItem(product.id, product.quantity + 1);
                              handlePlus(product.id);
                            }}
                            value="+"
                          />
                        </span>
                      </td>
                      <td>무료</td>
                      <td>
                        {product.couponDto || product.discount ? (
                          <>
                            <p>
                              {product.couponDto
                                ? commaMoney(product.totalDiscountedPrice)
                                : commaMoney(
                                    Math.ceil(
                                      product.price *
                                        (1 - 0.01 * product.discount)
                                    ) * product.quantity
                                  )}
                              원
                            </p>
                            <p>
                              <span>
                                {commaMoney(product.price * product.quantity)}원
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              {commaMoney(product.price * product.quantity)}원
                            </p>
                          </>
                        )}
                      </td>
                      <td
                        onClick={() => {
                          removeCartItem(product.cartItemId);
                        }}
                      >
                        <div
                          className="cancelBtn"
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            margin: "auto",
                          }}
                        >
                          <Image
                            src="/common/cancelred.png"
                            alt=""
                            layout="fill"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="orderSummary">
            <table>
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr style={{ height: "58px" }}>
                  <th scope="col">총 상품금액</th>
                  <th scope="col"></th>
                  <th scope="col">총 할인금액</th>
                  <th scope="col"></th>
                  <th scope="col">결제예정금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span>{commaMoney(totalPrice) || 0}</span>
                  </td>
                  <td>-</td>
                  <td>
                    <span>{commaMoney(discountPrice) || 0}</span>
                  </td>
                  <td>=</td>
                  <td>{commaMoney(totalPrice - discountPrice) || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="orderBtn">
          <div onClick={selectAllQuery}>
            <ButtonComp context="전체상품 주문" unvalid={totalUnValid} />
          </div>

          <div onClick={selectQuery}>
            <ButtonComp context="선택상품 주문" unvalid={selectUnValid} />
          </div>
        </div>
      </div>
      <style jsx>{`
        input {
          -webkit-appearance: none;
          -webkit-border-radius: 0;
        }
        .CartTitle {
          text-align: center;
          padding: 0;
          color: #3a3a3a;
          font-weight: 700;
        }

        .CartContents {
          text-align: center;
          margin: 0 auto;

          .orderTables {
            display: flex;
            flex-direction: column;
            align-items: center;

            .orderList {
              table {
                border-collapse: collapse;
                border-bottom: 1px solid #dfdfdf;
              }
              th {
                border: 0;
                margin: 0;
                padding: 0;

                border-spacing: 0;
                border-top: 2px solid #1a1a1a;
                border-bottom: 1px solid #dfdfdf;
              }

              td {
                .cartEmptyComment {
                  color: #9a9a9a;
                }

                .couponWrapper {
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  .couponContents {
                    display: flex;

                    p {
                      border: 1px solid;
                      width: 100px;
                      font-size: 16px;
                    }
                  }
                }

                input[type="button"] {
                  background-color: #fff;
                  border: 1px solid #c8c8c8;
                  border-radius: 50%;
                }

                input[type="button"]:disabled {
                  background: #dadada;
                  color: white;
                  border: none;
                }

                p {
                  margin: 0;

                  span {
                    color: ${NGray};
                    text-decoration: line-through;
                  }
                }
              }
            }
          }

          .orderSummary {
            table {
              border-collapse: collapse;
              border-bottom: 1px solid #dfdfdf;
              th {
                border: 0;
                margin: 0;
                padding: 0;

                border-spacing: 0;
                border-top: 2px solid #1a1a1a;
                border-bottom: 1px solid #dfdfdf;
              }
            }
          }

          .orderBtn {
            display: flex;
            justify-content: space-around;
          }
        }

        @media screen and (min-width: 769px) {
          /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */
          .CartTitle {
            margin-top: 96px;
            font-size: 30px;
            line-height: 1;
          }

          .CartContents {
            .orderTables {
              .orderList {
                table {
                  width: 1235px;

                  input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                  }

                  tr {
                    height: 115px;
                  }

                  td {
                    .cartEmptyImg {
                      margin: 70px auto 30px;
                      width: 70px;
                      height: 70px;
                    }
                    .cartEmptyComment {
                      margin-bottom: 70px;
                      font-size: 18px;
                      line-height: 1;
                    }

                    .thumnail {
                      width: 70px;
                      height: 70px;
                    }

                    .couponWrapper {
                      margin-top: 10px;

                      .couponContents {
                        line-height: 15px;
                        margin-right: 10px;
                      }
                    }

                    .minusBtn {
                      margin-right: 15px;
                    }
                    .plusBtn {
                      margin-left: 15px;
                    }

                    .cancelBtn {
                      width: 20px;
                      height: 20px;
                    }
                  }
                }
              }
            }

            .orderSummary {
              margin-top: 96px;

              table {
                width: 1235px;

                tbody {
                  tr {
                    height: 134px;
                  }
                }
              }
            }

            .orderBtn {
              margin: 38px auto 58px;
              width: 571px;
            }
          }
        }

        @media screen and (max-width: 768px) {
          /* 태블릿에 사용될 스트일 시트를 여기에 작성합니다. */
          .CartTitle {
            font-size: 3vw;
            font-weight: 700;
            line-height: 1;
          }

          .CartContents {
            width: 95vw;

            .orderTables {
              .orderList {
                table {
                  width: 95vw;

                  th {
                    font-size: 2vw;
                  }

                  tr {
                    height: 14vw;
                  }

                  td {
                    font-size: 2vw;

                    .cartEmptyImg {
                      margin: 30px auto 20px;
                      width: 40px;
                      height: 40px;
                    }
                    .cartEmptyComment {
                      margin-bottom: 30px;
                      font-size: 12px;
                      line-height: 1;
                    }

                    .thumnail {
                      width: 8vw;
                      height: 8vw;
                    }
                    img {
                      width: 8vw;
                    }

                    .couponWrapper {
                      margin-top: 10px;

                      .couponContents {
                        line-height: 15px;
                        margin-right: 10px;

                        input[type="text"] {
                          width: 15vw;
                        }
                      }
                    }

                    input[type="text"] {
                      width: 5vw;
                    }

                    input[type="button"] {
                      padding: 0;
                    }

                    .minusBtn {
                      margin: 0;
                      position: relative;
                      width: 3vw;
                      height: 3vw;
                      left: 1.5vw;
                      top: 5vw;
                    }
                    .plusBtn {
                      margin: 0;
                      position: relative;
                      width: 3vw;
                      height: 3vw;
                      left: -1vw;
                      top: 5vw;
                    }
                    p {
                      span {
                        font-size: 1vw;
                      }
                    }

                    .cancelBtn {
                      width: 15px;
                      height: 15px;
                    }
                  }
                }
              }
            }

            .orderSummary {
              margin-top: 7vw;
              width: 95vw;

              table {
                width: 95vw;

                tbody {
                  tr {
                    height: 80px;
                  }
                }
              }
            }

            .orderBtn {
              margin: 38px auto 58px;
              width: 70vw;
            }
          }
        }

        @media screen and (max-width: 480px) {
          /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */
          .CartTitle {
            font-size: 20px;
            line-height: 1;
          }

          .CartContents {
            width: 480px;

            .orderTables {
              .orderList {
                table {
                  width: 450px;
                  font-size: 12px;

                  tr {
                    height: 75px;
                  }

                  td {
                    font-size: 10px;

                    .cartEmptyImg {
                      margin: 30px auto 15px;
                      width: 40px;
                      height: 40px;
                    }
                    .cartEmptyComment {
                      margin-bottom: 30px;
                      font-size: 10px;
                      line-height: 1;
                    }

                    .thumnail {
                      width: 30px;
                      height: 30px;
                    }
                    img {
                      width: 15px;
                    }

                    .couponWrapper {
                      margin-top: 10px;

                      .couponContents {
                        line-height: 15px;
                        margin-right: 10px;

                        span {
                          font-size: 10px;
                        }
                      }
                    }

                    input[type="text"] {
                      width: 20px;
                    }

                    .minusBtn {
                      padding: 0;
                      position: relative;
                      width: 15px;
                      height: 15px;
                      left: 0px;
                      top: 20px;
                    }
                    .plusBtn {
                      padding: 0;
                      position: relative;
                      width: 15px;
                      height: 15px;
                      left: 3px;
                      top: 20px;
                    }

                    p {
                      span {
                        font-size: 10px;
                      }
                    }
                  }
                }
              }
            }

            .orderSummary {
              margin-top: 30px;
              width: 480px;

              table {
                margin: 0 auto;
                width: 450px;
              }
            }

            .orderBtn {
              margin: 38px auto 58px;
              width: 480px;
            }
          }
        }
      `}</style>
    </>
  );
}
