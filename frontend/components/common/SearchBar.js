import { Search } from "@mui/icons-material";
import Link from "next/link";
import { router } from "next/router";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { fetchAutoData } from "../../apis/AutoComplete";

export default function SearchBar({ value, setValue }) {
    const [keyword, setKeyword] = useState();
    const [resource, setResource] = useState();

    const [index, setIndex] = useState(-1);
    const [over, setOver] = useState(false);
    const autoRef = useRef(null);
    const inputRef = useRef(null);

    const onChangeData = (e) => {
        setKeyword(e.currentTarget.value);
    };

    const handleKeyArrow = (e) => {
        if (!data) return;

        if (data.autoKeyword.length > 0) {
            switch (e.key) {
                case "ArrowDown":
                    setIndex(index + 1);
                    if (autoRef.current?.childElementCount === index + 1) setIndex(0);
                    break;
                case "ArrowUp":
                    setIndex(index - 1);
                    if (index <= 0) {
                        setIndex(-1);
                    }
                    break;
                case "Escape":
                    setIndex(-1);
                    break;
                case "Enter":
                    if (index === -1) break;
                    var inputKeyword = autoRef.current.childNodes[index].childNodes[0].innerText;
                    setKeyword(inputKeyword);
                    inputRef.current.value = inputKeyword;
                    searchClick(inputKeyword);
                    break;
                default:
                    setIndex(-1);
            }
        }
    }

    useEffect(() => {
        autoComplete();
    }, [keyword]);

    useEffect(() => {
        function handleOutside(e) {
            if (autoRef.current && !autoRef.current.contains(e.target)) {
                setOver(false);
                setIndex(-1);
                console.log("over ", over);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, [autoRef]);

    // const updateChange = (e) => {
    //     if (isText(e.currentTarget.value)) {
    //         setValue(e.currentTarget.value);
    //     } else {
    //         alert("특수문자는 입력할 수 없습니다.");
    //         e.currentTarget.value = "";
    //     }
    // }

    function search(event) {
        if (event.key === "Enter") {
            if (keyword.length < 2 || keyword.length > 20) {
                alert("두 글자 이상 스무 글자 이하로 입력하세요.");
                return;
            }

            router.push(
                {
                    pathname: `/product`,
                    query: { cat_id: 0, search: keyword },
                },
                `/product`,
            );
            setIndex(-1);

        }
    }

    const autoComplete = async () => {
        if (keyword)
            setResource(fetchAutoData(keyword));
    }

    function searchClick(name) {
        inputRef.current.value = name;
        setKeyword(name);

        router.push(
            {
                pathname: `/product`,
                query: { cat_id: 0, search: name },
            },
            `/product`,
        );

        setIndex(-1);
    }

    const data = resource?.ProductNames.read();

    return (
        <>
            <div className="searchWrapper">
                <div className="search">
                    <input
                        ref={inputRef}
                        type="text"
                        size="30"
                        defaultValue={keyword}
                        placeholder="검색어를 입력해주세요"
                        onChange={(e) => onChangeData(e)}
                        onKeyUp={(event) => {
                            search(event, keyword);
                        }}
                        onKeyDown={(e) => handleKeyArrow(e)}
                        onFocus={(e) => { setOver(true); }}
                    />
                    <Link href={`/product?search=${keyword}`}>
                        <img src="/common/main_search.png" />
                    </Link>
                    {keyword?.length > 0 && over ?
                        <ul className="abs bk" ref={autoRef}>
                            {data?.autoKeyword.length > 0 ?
                                data?.autoKeyword?.map((productName, idx) => {
                                    return (
                                        productName.includes(keyword) ?
                                            <li className={index === idx ? "autoName isFocus" : "autoName"}
                                                onKeyDown={(e) => keypress(e, productName)}
                                                onClick={() => searchClick(productName)}>

                                                <div className="name">
                                                    {productName.split(keyword)[0]}
                                                    <span className="boldName">{keyword}</span>
                                                    {productName.split(keyword)[1]}
                                                </div>
                                            </li>
                                            : <li className={index === idx ? "autoName isFocus" : "autoName"} onClick={() => searchClick(productName)}><div className="name">{productName}</div></li>
                                    )
                                })
                                : <li className="autoName">최근 검색결과가 없습니다.</li>}
                        </ul> : ""
                    }
                    <style jsx>{`
                        .search {
                            position: absolute;
                            transform: translate(95%, 0%);
                            background: #fff;
                            border: 2px solid #ed1b23;

                            input[type="text"] {
                            border: none;
                            padding: 0;
                            box-sizing: border-box;
                            color: #c5c9cd;
                            font-weight: 600;
                            }

                            input[type="text"]:focus {
                            outline: none;
                            color: #000;
                            }

                            img {
                            position: relative;
                            }
                        }
                        .isFocus{
                            background: #e5e5e5;
                            cursor: pointer;
                        }
                        .bk {
                            /* border: 1px solid #ed1b23; */
                            width: 317px;
                            margin: 0;
                            padding: 0px;
                        }

                        .contour {
                            border: 1px solid #ed1b23;
                        }

                        .name {
                            padding: 2px 0px;
                        }

                        .autoName {
                            list-style: none;
                        }

                        .autoName:hover {
                            background: #e5e5e5;
                            cursor: pointer;
                        }

                        .boldName {
                            color:#ed1b23; 
                            font-weight:bold;
                        }

                        @media screen and (min-width: 769px) {
                        /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */
                        .searchWrapper {
                            left: 45%;
                            top: 35%;
                        }
                        .search {
                            border-radius: 15px;
                            padding: 0 17px;

                            input[type="text"] {
                                border-radius: 40px;
                                width: 317px;
                                height: 45px;
                                line-height: 45px;
                                font-size: 1em;
                            }

                            img {
                                width: 24px;
                                height: 24px;
                                top: 5px;
                            }
                        }

                        }

                        @media screen and (max-width: 768px) {
                        /* 태블릿에 사용될 스트일 시트를 여기에 작성합니다. */
                        }
                    `}
                    </style>
                </div>
            </div>
        </>
    );
};