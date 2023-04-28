/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" /> 
export declare type Chapters = {
    id: number,
    state_delete: number,
    state_sale: number,
    state_published: number,
    name: number,
    intro: number,
    book_id: number,
    volume_id: number,
    words: number,
    idx: number,
    hash: string,
    customer_id: number,
    client_id: number,
    customer_chapter_id: string,
    published_time: number,
    update_time: number,
    create_time: number,
    prev_id?:number,
    next_id?:number,
    content?:string,
    content_arr?:array
}; 
export declare type Categorys = {
    id: number,
    state_delete: number,
    customer_id: number,
    client_id: number, 
    name: number, 
    update_time: number,
    create_time: number,
    
    intro: number,
    parent_id:number,
    idx: number,
}; 

