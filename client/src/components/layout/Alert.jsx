import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  return (
    alerts &&
    alerts.length > 0 &&
    alerts.map((alerts) => {
      return (
        <div key={alerts.id} className={`alert alert-${alerts.alertType}`}>
          {alerts.msg}
        </div>
      );
    })
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert, // 看rootReducer中的变量名,把这个传给alert组件
});
//如果不传递 mapDispatchToProps 参数，默认值为 null
export default connect(mapStateToProps)(Alert);
