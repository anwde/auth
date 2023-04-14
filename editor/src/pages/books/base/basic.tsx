// @ts-nocheck
import Basic_Component from "../../../components/base/component";
import webapi from "../../../utils/webapi";
export default class Basic_Books extends Basic_Component {
    group = {};
    category_dict = {};
    category = [];
    tag = {};
    book = {};
    volume = {};
    volumes = {};
    channel = {};
    dutys = [];
    server_state = {};
    base_url = 'books/';
    constructor(props) {
        super(props);
        webapi.store.dispatch({
            type: "SIDEBARACTIVE",
            data: { expand: { 47: true }, selected: 48 },
        });
    }

    /*----------------------1 other start----------------------*/

    async get_dutys(reset = false) {
        if (reset || (this.dutys || []).length === 0) {
            const res = await webapi.request.get("books/home/duty", { loading: false });
            this.dutys = res.code === 10000 ? res.lists : [];
        }
        return this.dutys;
    }

    /**
     * other 获取服务器状态
     */
    async get_server_state(reset = false) {
        if (reset || Object.keys(this.server_state || {}).length === 0) {
            const res = await webapi.request.get(`books/home/state`, { cache: true, loading: false });
            this.server_state = res.code === 10000 ? res.data : {};
        }
        return this.server_state;
    }
    async get_category_dict(reset = false) {
        if (reset || Object.keys(this.category_dict || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}category/dict`, { cache: true, loading: false });
            this.category_dict = res.code === 10000 ? res.data : {};
        }
        return this.category_dict;
    }

    async get_category(reset = false) {
        if (reset || (this.category || []).length === 0) {
            const res = await webapi.request.get(`${this.base_url}category/tree`, { cache: true, loading: false });
            this.category = res.code === 10000 ? res.lists : [];
        }
        return this.category;
    }
    async get_tag(reset = false) {
        if (reset || Object.keys(this.tag || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}tags/dict`, { cache: true, loading: false });
            this.tag = res.code === 10000 ? res.data : {};
        }
        return this.tag;
    }
    async get_book(book_id, reset = false,) {
        if (reset || Object.keys(this.book[book_id] || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}home/get`, {
                data: {
                    id: book_id
                }
                , loading: false
            });

            this.book[book_id] = res.code === 10000 ? res.data : {};

        }
        return this.book[book_id];
    }
    async get_volumes(book_id, d = {}, reset = false) {
        const volumes = this.volumes
            ? this.volumes[book_id]
                ? this.volumes[book_id]
                : []
            : [];
        if (reset || volume.length === 0) {
            let p = d;
            p.book_id = book_id;
            p.loading = false;
            const res = await webapi.request.get(`${this.base_url}volumes/lists`, p);
            if (res.code === 10000) {
                volume = res.lists;
            }
        }
        this.volumes[book_id] = volumes;
        return this.volumes[book_id];
    }
    async get_volume_dict(book_id, reset = false) {
        let volume = this.volume
            ? this.volume[book_id]
                ? this.volume[book_id]
                : {}
            : {};
        if (reset || Object.keys(volume).length === 0) {
            const data = { book_id };
            const res = await webapi.request.get(`${this.base_url}volumes/dict`, { data, loading: false });
            if (res.code === 10000) {
                volume = res.data;
            }
        }
        this.volume[book_id] = volume;
        return this.volume[book_id];
    }

    async get_channel(reset = false) {
        if (reset || Object.keys(this.channel).length === 0) {
            const res = await webapi.request.get("books/home/channel", { loading: false });
            this.channel = res.code === 10000 ? res.data : {};
        }
        return this.channel;
    }

    async get_author_info(user_id, reset = false) {
        let author = this.authors
            ? this.authors[user_id]
                ? this.authors[user_id]
                : {}
            : {};
        if (reset || Object.keys(author).length === 0) {
            var res = await webapi.request.get("novel/author/info", {
                user_id,
            });
            if (res.code === 10000) {
                author = res.data;
            }
        }
        this.authors = this.authors || {};
        this.authors[user_id] = author;
        return this.authors[user_id];
    }
    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/

    __handle_init_before = () => {
        if (!this.category || this.category.length === 0) {
            this.get_category();
        }
        if (!this.channel || Object.keys(this.channel).length === 0) {
            this.get_channel();
        }
        // this.get_dutys();
        if (
            !this.server_state ||
            Object.keys(this.server_state).length === 0
        ) {
            this.get_server_state();
        }
    };

    __init_state_before() {
        return {
            checked_ids: {},
            checkbox_all: false,
            book_id: this.props.match.params.book_id || 0,
        };
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    handle_checkbox_ids = (checked_ids, fun) => {
        this.setState({ checked_ids }, () => { fun && fun() });
    }
    handle_checkbox_all = () => {
        const checkbox_all = !this.state.checkbox_all;
        const checked_ids = this.state.checked_ids || {};
        this.state.lists.map((item, key) => {
            if (checked_ids[item.id]) {
                delete checked_ids[item.id];
            } else {
                checked_ids[item.id] = item.id;
            }
        });
        this.setState({ checkbox_all });
        this.handle_checkbox_ids(checked_ids);
    };
    handle_checkbox = (id) => {
        let checkbox_all = this.state.checkbox_all;
        const checked_ids = this.state.checked_ids || {};
        if (checked_ids[id]) {
            delete checked_ids[id];
        } else {
            checked_ids[id] = id;
        }
        if (Object.keys(checked_ids).length == this.state.lists.length) {
            checkbox_all = true;
        }
        this.setState({ checkbox_all, checked_ids });
    };
    __handle_init_index = () => {
        this.setState({ pagination: this.__init_page_data() }, () => { this.__init_index() });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/

    /*----------------------4 render end  ----------------------*/
}
