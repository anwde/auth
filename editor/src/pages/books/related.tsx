// @ts-nocheck
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React from "react";
import { connect } from "react-redux";
import webapi from '../../utils/webapi';
import Basic_Books from './base/books';
const BREADCRUMB = {
  title: "作品管理",
  lists: [
  ],
  buttons: [

  ],
};

class Books extends Basic_Books {
  formRef = React.createRef();
  base_url: string = 'books/related/';
  /**
   * 构造
   */
  constructor(props) {
    super(props);
  }

  /*----------------------1 other start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  async get_book(book_id, reset = false,) {
    if (reset || Object.keys(this.book[book_id]).length === 0) {
      const res = await webapi.request.get(`${this.base_url}related/get`, {
        data: {
          id: book_id
        }
        , loading: false
      });

      this.book[book_id] = res.code === 10000 ? res.data : {};

    }
    return this.book[book_id];
  }
  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  //构建-url-提交
  handle_submit_build_url = (url) => {
    return 'books/related/dopost';
  }
  //构建-数据-提交
  handle_submit_build_data = (data, values) => {
    data.append("book_id", values.book_id || 0)
    return data;
  }
  _handle_delete_build_url = () => {
    return `books/related/delete`;
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  //  添加-作品
  __render_add_edit(u_action) {
    const state = this.state;
    const upload_style = {
      textAlign: 'center',
      verticalAlign: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'border-color 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      border: state.upload_books_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9',
      position: 'relative',
    };
    const select_style = {
      width: '102px',
      height: '102px',
      marginInlineEnd: '8px',
      marginBottom: '8px',
      textAlign: 'center',
      verticalAlign: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'border-color 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      border: state.select_books_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9',
    };
    return (
      <Form
        {...this.__form_item_layout()}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        ref={this.formRef}
        onFinish={this.handle_submit}
      >
        <Form.Item label="选择作品">
          <div style={select_style}
            onMouseEnter={() => this.handleSelectBooksMouseEnter('select_books_hover')}
            onMouseLeave={() => this.handleSelectBooksMouseLeave('select_books_hover')}
            onClick={() => this.handle_modal_books_lists()}
          >
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              点这里添加
            </div>
          </div>

        </Form.Item>
        <Form.Item label="封面图片">

          <ImgCrop rotationSlider modalTitle="请编辑图片" aspect={0.618}>
            <Upload {...this.__upload_single_props()}
            >

              <div style={upload_style}
                onMouseEnter={() => this.handleSelectBooksMouseEnter('upload_books_hover')}
                onMouseLeave={() => this.handleSelectBooksMouseLeave('upload_books_hover')}
              >
                <Image
                  style={{ borderRadius: '0.6rem' }}
                  preview={false}
                  width={170.8152}
                  height={200}
                  src={state.data.image || ''}
                  fallback="data:image/png;base64,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"
                />
              </div>
            </Upload>

          </ImgCrop>
        </Form.Item>
        <Form.Item label="作品名称" name="name">
          <Input placeholder="输入名称" />
        </Form.Item>
        <Form.Item label="作品ID" name="book_id">
          <Input placeholder="输入book_id" />
        </Form.Item>

        <Form.Item label="作品介绍" name="intro">
          <Input.TextArea
            placeholder="请输入介绍"
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea
            placeholder="请输入描述"
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </Form.Item>
        <Form.Item label="关键字" name="keywords">
          <Input.TextArea
            placeholder="请输入关键字"
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </Form.Item>
        {this.state.add_edit_modal_visible ? (
          ""
        ) : (
          <Form.Item {...this.__tail_layout()}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              提交保存
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  }
  __render_index() {
    const state = this.state;
    console.log('data=>', state);
    return (

      this.__render_components_lists({
        generate_cover_mage: true,

        pagination: state.pagination,
        request_url: 'books/related/lists',
        metas: {
          title: {
            click: (item) => this.handle_edit(item.id, item),
          },
          subTitle: {},
          description: {

          },
          actions: {

          },
          avatar: {

          },
          content: {

          },
          extra: {}

        }
      })



    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Books);
