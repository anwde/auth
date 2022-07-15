import React from "react";
import classnames from "classnames";
import Slide_Base from "./slide_base.js";
import { CSSTransition } from "react-transition-group"; 
import defaultImg from "./default.jpeg";
import style from "./captcha.less"; 
// console.log('captcha=>',style);
class SlideFixed extends Slide_Base {
  constructor(props) {
    super(props);
    this.state = {
      blockSize: {
        width: "50px",
        height: "50px",
      },
      setSize: {
        imgHeight: 155,
        imgWidth: 310,
        barHeight: 40,
        barWidth: 310,
      },
      img_type:'base64',
      backImgBase: "", // 验证码背景图片
      blockBackImgBase: "", // 验证滑块的背景图片
      backToken: "", // 后端返回的唯一token值
      startMoveTime: "", //移动开始的时间
      endMovetime: "", //移动结束的时间
      tipsBackColor: "", //提示词的背景颜色
      secretKey: "", //后端返回的加密秘钥 字段
      u_action: "slide",
      moveBlockBackgroundColor: "rgb(255, 255, 255)",
      leftBarBorderColor: "",
      iconColor: "",
      barAreaLeft: 0,
      barAreaOffsetWidth: 0,
      startLeft: null,
      moveBlockLeft: null,
      leftBarWidth: null,
      status: false, //鼠标状态
      isEnd: false, //是够验证完成
      passFlag: "",
      tipWords: "",
      text: "向右滑动完成验证",
    };
  }

  componentDidMount() { 
    this.getData();
    this.init();
  }

 
 

  render() {
    const {
      vSpace,
      barSize, 
      transitionWidth,
      finishText,
      transitionLeft,
      imgSize,
      show,
    } = this.props;
    return (
      // 蒙层
      <div className={style.mask} style={{ display: show ? "block" : "none" }}>
        <div
          className={style.verifybox}
          style={{ maxWidth: parseInt(imgSize.width) + 30 + "px" }}
        >
          <div className={style['verifybox-top']}>
            请完成安全验证
            {this.state.backImgBase ? ( 
            <span className={style['verifybox-close']} onClick={() => this.closeBox()}>
              <i className={classnames(style.iconfont,style['icon-close'])}></i>
            </span>
            ):""}
          </div>
          <div className={style['verifybox-bottom']} style={{ padding: "15px" }}>
           
            <div style={{ position: "relative" }} className="stop-user-select">
              <div
                className={style['verify-img-out']}
                style={{
                  height: parseInt(this.state.setSize.imgHeight) + vSpace,
                }}
              >
                <div
                  className={style['verify-img-panel']}
                  style={{
                    width: this.state.setSize.imgWidth,
                    height: this.state.setSize.imgHeight,
                  }}
                > 
                  {this.state.backImgBase ? (
                    <img
                      src={(this.state.img_type=='base64'?"data:image/png;base64,":'') + this.state.backImgBase}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                  ) : (
                    <img
                      src={defaultImg}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                  )}


                    
                  <div
                    className={style['verify-refresh']}
                    onClick={() => this.refresh()}
                  > 
                    <i className={classnames(style.iconfont,style['icon-refresh'])}></i>
                  </div>
                  <CSSTransition
                    in={this.state.tipWords.length > 0}
                    timeout={150}
                    classNames="tips"
                    unmountOnExit
                  >
                    <span
                      className=
                        {classnames(style['verify-tips'],this.state.passFlag?style['suc-bg']:style['err-bg'])}
                        
                    >
                      {this.state.tipWords}
                    </span>
                  </CSSTransition>
                </div>
              </div>
              {this.state.backImgBase ? (
              <div
                className={style['verify-bar-area']}
                style={{
                  width: this.state.setSize.imgWidth,
                  height: barSize.height,
                  lineHeight: barSize.height,
                }}
                ref={(bararea) => this.setBarArea(bararea)}
              >
                <span className={style['verify-msg']}>{this.state.text}</span>
                <div
                  className={style['verify-left-bar']}
                  style={{
                    width:
                      this.state.leftBarWidth !== undefined
                        ? this.state.leftBarWidth
                        : barSize.height,
                    height: barSize.height,
                    borderColor: this.state.leftBarBorderColor,
                    transaction: transitionWidth,
                  }}
                >
                  <span className={style['verify-msg']}>{finishText}</span>

                  <div
                    className={style['verify-move-block']}
                    onTouchStart={(e) => this.start(e)}
                    onMouseDown={(e) => this.start(e)}
                    style={{
                      width: barSize.height,
                      height: barSize.height,
                      backgroundColor: this.state.moveBlockBackgroundColor,
                      left: this.state.moveBlockLeft,
                      transition: transitionLeft,
                    }}
                  >
                    <i
                      className={classnames(style.iconfont,style['verify-icon'],style['icon-right'])}
                      style={{ color: this.state.iconColor }}
                    ></i>
                    {this.state.blockBackImgBase?(
                    <div
                      className={style['verify-sub-block']}
                      style={{
                        width:
                          Math.floor(
                            (parseInt(this.state.setSize.imgWidth) * 47) / 310
                          ) + "px",
                        height: this.state.setSize.imgHeight,
                        top:
                          "-" +
                          (parseInt(this.state.setSize.imgHeight) + vSpace) +
                          "px",
                        backgroundSize:
                          this.state.setSize.imgWidth +
                          " " +
                          this.state.setSize.imgHeight,
                      }}
                    >
                      <img 
                        src={
                          (this.state.img_type==='base64'?"data:image/png;base64,":'') + this.state.blockBackImgBase
                        }
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      />
                    </div>
                    ):''}
                  </div>
                </div>
              </div>
              ):''}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

SlideFixed.defaultProps = {
  mode: "fixed",
  vSpace: 5,
  imgSize: {
    width: "310px",
    height: "200px",
  },
  barSize: {
    width: "310px",
    height: "40px",
  },
  setSize: {
    imgHeight: 155,
    imgWidth: 310,
    barHeight: 0,
    barWidth: 0,
  },
};

export default SlideFixed;
