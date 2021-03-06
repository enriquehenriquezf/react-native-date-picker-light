import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet , Image} from "react-native";
import moment from "moment/min/moment-with-locales";
var esLocale = require('moment/locale/es');
import PropTypes from 'prop-types';


const days = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];


export default class DatePicker extends Component {
  constructor() {
    super();
    this.state = {
      arrowCount: 0,
      weekObject: [],
      selectedDate: {
        day: null,
        date: null
      }
    };
  }
  async componentDidMount() {
    await moment.locale(this.props.locale);
    await this.setState({
      selectedDate: {
        day: moment(this.props.startDate).format("ddd").slice(0,3),
        date: moment(this.props.startDate).format(this.props.dateFormat)
      }
    });
    console.log(moment(this.props.startDate).format("ddd").slice(0,3))
    console.log(moment(this.props.startDate).format(this.props.dateFormat))
    this.dateCreator();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.weekObject != nextState.weekObject ||
      this.state.selectedDate != nextState.selectedDate
    );
  }

  dateCreator = () => {
    const daysArray = days;
    
    let weekObject = [...this.state.weekObject];
    weekObject[this.state.arrowCount] = [];
    let todaysDateIndex = daysArray.indexOf(moment().format("ddd").slice(0,3));

    for (let day in daysArray) {
      let selectedWeekDaySet =
        day - todaysDateIndex + this.state.arrowCount * 7;
      let calenderDay = daysArray[day];
      let dateObject = {
        day: calenderDay,
        date: moment()
          .add(selectedWeekDaySet, "day")
          .format(this.props.dateFormat),
        monthYear: moment()
          .add(selectedWeekDaySet, "day")
          .format("MMMM YYYY"),
        month: moment()
          .add(selectedWeekDaySet, "day")
          .format("MM"),
        year: moment()
          .add(selectedWeekDaySet, "day")
          .format("YY"),
        shortDate: moment()
          .add(selectedWeekDaySet, "day")
          .format("L"),
        shortDateTime: moment()
          .add(selectedWeekDaySet, "day")
          .format()
      };
      weekObject[this.state.arrowCount][day] = dateObject;
    }

    this.setState({ weekObject });
  };

  handlePress = async date => {
    if (
      this.state.selectedDate.day == date.day &&
      this.state.selectedDate.date == date.date
    ) {
      this.setState({ selectedDate: { day: null, date: null } });
    } else{
      let dates = {
        day: date.day,
        date: date.date,
        monthYear: date.monthYear,
        month: date.month,
        year: date.year,
        shortDate: date.shortDate,
        shortDateTime: date.shortDateTime
      }
      await this.setState({
        selectedDate: {
          day: date.day,
          date: date.date
        }
      });
      await this.props.selected(dates)
    }
  };

  handleArrowChange = time => {
    this.setState({ arrowCount: this.state.arrowCount - time }, () => {
      this.dateCreator();
    });
  };

  handleMonthYearComponent = () => {
    if(this.state.weekObject.length > 0)
    return <Text  style={Styles.dateComponentYearText}>{this.state.weekObject[this.state.arrowCount][1].monthYear}</Text>
  }

  handleDateComponentDisplay = () => {
    return this.state.weekObject[this.state.arrowCount].map((date, index) => {
      let isPressed =
        this.state.selectedDate.day == date.day &&
        this.state.selectedDate.date == date.date;
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.handlePress(date)}
          style={Styles.dateComponentDateTouchable}
          >
          <Text style={{ color: this.props.depressedColor  }}>
            {date.day}
          </Text>
          <View style={{backgroundColor: isPressed ? this.props.pressedColor : 'transparent', borderRadius:25,width:20}}>
            <Text style={{ color: this.props.depressedColor, textAlign:'center'  }}>
              {date.date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  render() {
    return (
      <View style={Styles.dateComponentView}>
        {this.handleMonthYearComponent()}
        <View style={Styles.dateComponentDateView}>
          <Text />
          <TouchableOpacity onPress={() => this.handleArrowChange(1)}>
            <Image style={{width: this.props.iconSize, height: this.props.iconSize}} 
            source={require('./left-arrow.png')}
            />
          </TouchableOpacity>
          {this.state.weekObject.length != 0 &&
            this.handleDateComponentDisplay()}
          <TouchableOpacity onPress={() => this.handleArrowChange(-1)}>
          <Image style={{width: this.props.iconSize, height: this.props.iconSize}} 
            source={require('./right-arrow.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
DatePicker.defaultProps = {
    iconSize: 30,
    dateFormat: "D",
    pressedColor: "#fff",
    depressedColor: "#7d7c7b",
    locale: 'es'//-mx
}

DatePicker.propTypes = {
  iconSize: PropTypes.number,
  dateFormat: PropTypes.string,
  pressedColor: PropTypes.string,
  depressedColor: PropTypes.string,
  selected: PropTypes.func,
  locale: PropTypes.string
}


const Styles = StyleSheet.create({
  dateComponentView: {
    flex: 1, flexDirection: "column" , alignItems: 'center'
  },
  dateComponentYearText: {
    color: '#fff', fontSize: 20
  },
  dateComponentDateTouchable: {
    flex: 1,
    flexDirection: "column",
    color: "#7d7c7b",
    alignItems: "center"
  },
  dateComponentDateView: {
    flex: 1, flexDirection: "row", marginTop: 10
  }
})
