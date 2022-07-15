import React from "react";
import PropTypes from "prop-types";

const RecentComment = (props) => {
  /*--------------------------------------------------------------------------------*/
  /* Used In Dashboard-4 [General]                                                  */
  /*--------------------------------------------------------------------------------*/
  const image = (
    <div className="p-2">
      <img src={props.image} alt="user" width="40" className="rounded-circle" />
    </div>
  );
  const badge = (
    <span
      className={
        "rounded-pill px-2 font-medium text-uppercase badge badge-" +
        props.badgeColor
      }
    >
      {props.badge}
    </span>
  );
  const name = <h5 className="font-normal mb-1">{props.name}</h5>;
  const comment = (
    <span className="mb-3 d-block text-muted font-weight-light mt-3">
      {props.comment}
    </span>
  );
  const date = <span className="text-muted font-12 mr-2">{props.date}</span>;
  return (
    <div className="d-flex flex-row comment-row mt-0">
      {image}
      <div className="comment-text w-100">
        {name}
        {date}
        {badge}
        {comment}
      </div>
    </div>
  );
};

RecentComment.defaultProps = {
  badgeColor: "primary",
};

RecentComment.propTypes = {
  badgeColor: PropTypes.oneOf([
    "primary",
    "success",
    "info",
    "danger",
    "warning",
    "orange",
    "cyan",
  ]),
  image: PropTypes.string,
  name: PropTypes.node,
  comment: PropTypes.node,
  date: PropTypes.node,
  badge: PropTypes.string,
};

export default RecentComment;
