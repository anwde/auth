import Basic_Component from "../../components/base/component";
import webapi from "../../utils/webapi";

const BREADCRUMB = {
    title: "作品管理",
    lists: [
        {
            title: "作品管理",
            url: "/novel/books",
        },
    ],
    buttons: [
        {
            title: "创建作品",
            url: "/novel/books/add",
        },
    ],
};
export default class Basic_Book extends Basic_Component {
    group = {};
    category_dict = {};
    category = [];
    tag = {};
    constructor(props) {
        super(props);
    }

    /*----------------------0 parent start----------------------*/
    async get_group(reset = false) {
        let group = this.group || {};
        if (reset || Object.keys(group).length === 0) {
            group = webapi.cache.get("category_group");
            if (!group) {
                const res = await webapi.request.get("books/category/group");
                if (res.code === 10000) {
                    group = res.data;
                    webapi.cache.set("category_group", group, 60 * 60 * 1);
                }
            }
            this.group = group;
        }
        return group;
    }
    async get_category_dict(reset = false) {
        var category_dict = this.category_dict || {};
        if (reset || Object.keys(category_dict).length === 0) {
            category_dict = webapi.cache.get("category_dict");
            if (!category_dict) {
                let res = await webapi.request.get("books/category/dict");
                if (res.code === 10000) {
                    category_dict = res.data;
                    webapi.cache.set("category_dict", category_dict, 60 * 60 * 1);
                }
            }
            this.category_dict = category_dict;
        }
        return category_dict;
    }

    async get_category(reset = false) {
        let category = this.category || [];
        if (reset || category.length === 0) {
            let c = webapi.cache.get("books_category");
            if (!c) {
                let res = await webapi.request.get("novel/books/category");
                if (res.code === 10000) {
                    category = res.lists;
                    webapi.cache.set("books_category", category, 60 * 60 * 1);
                }else{
                    category=[];
                }
            }else{
                category=c as unknown as [];
            }
            this.category = category;
        }
        return category;
    }
    async get_tag(reset = false) {
        var tag = this.tag || {};
        if (reset || Object.keys(tag).length === 0) {
            tag = webapi.cache.get("books_tag");
            if (Object.keys(tag).length == 0) {
                let res = await webapi.request.get("novel/books/tag");
                if (res.code === 10000) {
                    tag = res.data;
                    webapi.cache.set("books_tag", tag, 60 * 60 * 1);
                }
            }
            this.tag = tag;
        }
        return tag;
    }
    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/

    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    __init_index = (d = {}, top = true) => { }
    __handle_init_index = () => {
        this.setState({ pagination: this.__init_page_data() }, () => { this.__init_index() });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/

    /*----------------------4 render end  ----------------------*/
}