// Bai 5 - Tạo component tìm kiếm học sinh
import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Tìm kiếm theo tên...', className = '' }) {
    return (
        <div className={"search-bar " + className}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
            />
        </div>
    );
}
