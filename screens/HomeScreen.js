import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Picker,
  Modal
} from 'react-native';

import { MonoText } from '../components/StyledText';
import { white } from 'ansi-colors';

export default class HomeScreen extends Component {
  state = {
    blank: [
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0] ],

      rowIndex: 0,
      boxIndex: 0,
      editModal: false,
      options: [1,2,3,4,5,6,7,8,9]
  }
  
  componentDidMount(){
    fetch('http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=2', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
    .then(responseJson => {
      let arr = responseJson.squares
      let copy = this.state.blank
      for(let i=0;i<arr.length;i++){
        let x = arr[i].x;
        let y = 8 - arr[i].y;
        copy[y][x] = arr[i].value
      }
      this.setState({blank: copy})
    })
  }

  showEdit(rowIndex, boxIndex){
    this.setState({rowIndex: rowIndex, boxIndex: boxIndex, editModal: true})
  }

  editOption(val){
    let copy = this.state.blank
    copy[this.state.rowIndex][this.state.boxIndex] = val
    this.setState({blank: copy, editModal: false})
  }

  checkSolution(){
    let correct = true
    let test = []
    let squareCount = 0

    for(let i=0;i<board.length;i++){
      let rowArr = []
      for(let j=0;j<board[i].length;j++){
        if(rowArr.includes(board[i][j])){
          return correct = false
        }
        else{
          rowArr.push(board[i][j])
        }
      }
      rowArr = []
    }

    for(let i=0;i<board.length;i++){
      let colmnArr = []
      let index = 0
      for(let j=0;j<board.length;j++){
        if(colmnArr.includes(board[j][index])){
          return correct = false
        }
        else{
          colmnArr.push(board[j][index])
        }
      }
      index++
      colmnArr = []
    }

    let rowIndex = 0

    for(i=0; i<27;i++){
      if(!correct){
        return correct = false
      }
      if(board[rowIndex-1]){
        if(board[rowIndex-1].length === 0){
          board.splice(rowIndex-1, 1)
          rowIndex = 0
        }
      }
      let colIndex = 0

      for(let j=0; colIndex<3;j++){
        if(!board[rowIndex-1]){
          if(board[rowIndex].length === 9){
            j = 0
          }
        }
        if(board[rowIndex][j] === 0){
          return correct = false
        }
        if(test.length === 9){
          test = []
        }
        else if(test.includes(board[rowIndex][j])){
          return correct = false
        }
        else{
          test.push(board[rowIndex][j])
          board[rowIndex].splice(j, 1)
          colIndex++
          j--
        }
      }
      
      rowIndex++
      if(board[rowIndex]){
        if(board[rowIndex].length > 0){
          if(rowIndex > 2){
            rowIndex = 0
            test = []
          }
        }
        
      }
      else if(rowIndex > 2){
        rowIndex = 0
        test = []
      }
      

    }
    return correct
  }

  render(){
    let board = this.state.blank.map((row, rowIndex) => {
      let boxes = row.map((box, boxIndex) => {
        return (


          <View style={{borderWidth: 1, borderColor: 'black', width: 50, height: 50, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {box > 0
            
              ?
              <TouchableOpacity style={styles.greyedButton} >
                <Text>{box}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.button} onPress={() => this.showEdit(rowIndex, boxIndex)}>
                <Text>{' '}</Text>
              </TouchableOpacity>
            }
            {/* <Text style={{textAlign: 'center'}} onPress={() => this.showEdit(rowIndex, boxIndex)}>{box > 0 ? box : ' '}</Text> */}
            
          </View>
        )
      })
      return boxes
    })

    let optionsRows = this.state.options.map((option, i) => {
      let selected = this.state.blank[this.state.rowIndex][this.state.boxIndex]
      return(
        // <Button
        //   title={`${option}`}
        //   onPress={() => {
        //     this.setState({editModal: false});
        //   }}
        // />
        <TouchableOpacity style={selected === option ? styles.selectedButton : styles.optionButton} onPress={() => this.editOption(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
      )
    })

    return (
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <Modal
          animationType='slide'
          visible={this.state.editModal}
        >
          <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
            {optionsRows}
          </View>
          <Button
          title='Cancel'
          color='red'
            onPress={() => {
              this.setState({editModal: false});
            }}
            
          />
        </Modal>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>
  
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 25}}>
            {board}
          </View>    
          <Button title='Check Solution' onPress={() => this.checkSolution}/>
        </ScrollView>
      </View>
    )
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  optionButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    width: 100,
    height: 100,
    margin: 15,
  },
  selectedButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    width: 100,
    height: 100,
    margin: 15,
    backgroundColor: 'cyan',
  },
  button: {
    backgroundColor: 'white',
    color: 'black',
    width: 49,
    height: 49,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  greyedButton: {
    backgroundColor: '#D3D3D3',
    color: 'black',
    width: 49,
    height: 49,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  }
});
