import React from "react";
import SearchForm from "./SearchForm.jsx";
import AddUser from "./AddUser.jsx";
import ResultTable from "./ResultTable.jsx";

export default function App(){
    const [kw, setKeyword] = React.useState("");
    const [newUser, setNewUser] = React.useState(null);
    const [adding, setAdding] = React.useState(false); // Trạng thái ban đầu false - không hiển thị form thêm người dùng
    
    return(
        <div>
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Quản lý người dùng</h1>
            
            <div className="search-bar-container">
                <SearchForm onChangeValue={setKeyword} value={kw} /> {/* Chuyền 2 tham số vào hàm SearchForm */}
                <button className="btn-primary btn-add" onClick={() => setAdding(true)}>
                    Thêm {/* Chuyển button Thêm từ file AddUser sang App để quản lý dễ hơn, design dễ hơn*/}
                </button>
            </div>
            
            <AddUser onAdd={setNewUser} adding={adding} setAdding={setAdding} /> {/* Chuyền 3 tham số vào hàm AddUser  */}
            <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} /> {/* Tương tự*/}
        </div>
    )
}
