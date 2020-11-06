import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Picker, TouchableHighlight, ScrollView, ToastAndroid } from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/Feather'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['No. Container', 'Size', 'Type', 'Slot', 'Row', 'Tier'],
      sizeMap: [],
      typeMap: [],
      modalVisible: false,
      visible: false,
      edit: false
    }
  }

  handlingSearch1 = async (e, value) => {
    try {
      console.log(value, 'inie')
      this.setState({
        typing1: value
      })
      const { data } = await axios.get(`http://192.168.1.4:3000/v1/readUpdate?barang=${value}`)
      console.log(data, 'inisearch')
      // if (data.result > 0) {
      let datas = data.result.map(datas => {
        return [
          datas.No_Container,
          datas.Size,
          datas.Type,
          datas.Slot,
          datas.Row,
          datas.Tier,
        ]
      });
      this.setState({
        tableData1: datas,
        deleteH: true,
        number: datas[0]
      })
    } catch (e) {
      console.error('ini error')
    }
    // } else {
    //   this.getTable()
    // }
  }

  handlingSearch3 = async (e, value) => {
    console.log(value, 'inie')
    this.setState({
      typing3: value
    })
    await axios.get(`http://192.168.1.4:3000/v1/readUpdate?barang=${value}`).then((body) => {
      this.setState({
        updateCari: true
      })
    })
    // console.log(data, 'inisearch')
    // if (data.result > 0) {
    // } else {
    //   this.getTable()
    // }
  }

  handlingSearch = async (e, value) => {
    console.log(value, 'inie')
    this.setState({
      typing: value
    })
    const { data } = await axios.get(`http://192.168.1.4:3000/v1/read?barang=${value}`)
    console.log(data, 'inisearch')
    // if (data.result > 0) {
    let datas = data.result.map(datas => {
      return [
        datas.No_Container,
        datas.Size,
        datas.Type,
        datas.Slot,
        datas.Row,
        datas.Tier,
      ]
    });
    this.setState({
      tableData: datas,
      number: datas[0]
    })
    // } else {
    //   this.getTable()
    // }
  }
  getTable = async () => {
    const { data } = await axios.get(`http://192.168.1.4:3000/v1/readAll`)
    let datas = data.result.map(datas => {
      return [
        String(datas.No_Container).length > 4 ? String(datas.No_Container).substring(0, 4) + "..." : datas.No_Container,
        datas.Size,
        datas.Type,
        datas.Slot,
        datas.Row,
        datas.Tier,
      ]
    });
    console.log('iki')
    console.log(data, 'inininin')
    this.setState({
      tableData: datas
    })
    try {
    } catch (error) {
      console.error('error')
    }
  }

  sizeGet = async () => {
    const { data } = await axios.get(`http://192.168.1.4:3000/v1/size`)
    console.log('iki')
    console.log(data, 'yah')
    this.setState({
      sizeMap: data.result
    })
    try {
    } catch (error) {
      console.error('error')
    }
  }

  Type = async () => {
    const { data } = await axios.get(`http://192.168.1.4:3000/v1/type`)
    console.log('iki')
    console.log(data, 'yah')
    this.setState({
      typeMap: data.result
    })
    try {
    } catch (error) {
      console.error('error')
    }
  }


  async componentWillUnmount() {
    clearInterval(this.Timer)
  }

  async componentDidMount() {
    this.Timer = setInterval(() => {
      if (!this.state.typing) {
        this.getTable()
      }
    }, 5000);
    await this.sizeGet()
    // await this.handlingSearch()
    await this.Type()
  }


  handleChange = (name, e) => {
    this.setState({
      [name]: e
    })
  }

  hideMenu = (e) => {
    this.setState({
      visible: e
    })
  };

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  deleteShow = () => {
    this.setState({
      delete: true,
      createShow: false,
      edit: false,
    })
  }
  editShow = () => {
    this.setState({
      number: '',
      sizePick: '',
      typePick: '',
      slot: '',
      row: '',
      tier: '',
      edit: true,
      createShow: false,
      delete: false
    })
  }
  sizePick = (e) => {
    this.setState({
      sizePick: e
    })
  }
  typePick = (e) => {
    this.setState({
      typePick: e
    })
  }
  batal = () => {
    this.setState({
      number: '',
      sizePick: '',
      typePick: '',
      slot: '',
      row: '',
      tier: '',
      createShow: false,
      edit: false,
      delete: false
    })
  }
  updateShow = () => {
    this.setState({
      number: '',
      sizePick: '',
      typePick: '',
      slot: '',
      row: '',
      tier: '',
      createShow: true,
      edit: false,
      delete: false
    })
  }
  handleDelete = async () => {
    await axios.delete(`http://192.168.1.4:3000/v1/delete/${this.state.typing1}`).then((body) => { console.log("berhasil") }).then((body) => {
      ToastAndroid.show("Data Berhasil Dihapus", ToastAndroid.SHORT)
      this.setState({
        number: '',
        sizePick: '',
        typePick: '',
        slot: '',
        row: '',
        tier: '',
        createShow: false,
        edit: false,
        delete: false
      })
    })
  }
  delete = () => {
    return (
      <View style={{ backgroundColor: '#FFF', flex: 1, display: this.state.delete ? "flex" : "none" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text>Delete Data</Text>
        </View>
        <View>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TextInput style={{ backgroundColor: '#FFF' }} placeholder="Search" onChangeText={value => this.handlingSearch1('typing1', value)} />
          </View>
          <View>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
              <ScrollView>
                <Rows data={this.state.tableData1} textStyle={styles.text} />
              </ScrollView>
            </Table>
          </View>
          <View style={{ flexDirection: 'row', top: 10 }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', display: this.state.deleteH ? 'flex' : 'none' }}>
              <Button
                onPress={this.handleDelete}
                title="Delete"
                color="#841584"
                accessibilityLabel="Delete"
              />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start", flexDirection: 'row', left: 10 }}>
              <Button
                onPress={this.batal}
                title="Cancel"
                color="#841584"
                accessibilityLabel="Cancel"
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  New = () => {
    if (this.state.createShow) {
      return (
        <View style={{ backgroundColor: '#FFF', flex: 1, display: this.state.createShow ? "flex" : "none" }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text>Edit Data</Text>
          </View>
          <View style={{ height: 350 }}>
            <ScrollView>
              {/* <Text>Edit Data</Text> */}
              <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput style={{ backgroundColor: '#FFF' }} placeholder="Search" onChangeText={value => this.handlingSearch3('typing3', value)} />
              </View>
              <View style={{ display: this.state.updateCari ? "flex" : "none" }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>No. Container</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput placeholder="Masukkan No. Container" onChangeText={value => this.handleChange('number', value)} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>Size</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      selectedValue={this.state.sizePick}
                      style={{ height: 50, width: 150 }}

                      onValueChange={(itemValue, itemIndex) => this.sizePick(itemValue)}
                    >
                      {this.state.sizeMap.map((item, index) =>
                        <Picker.Item key={index} label={item.size.toString()} value={item.id} />
                      )}
                    </Picker>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>Type</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      selectedValue={this.state.typePick}
                      style={{ height: 50, width: 150 }}
                      onValueChange={(itemValue, itemIndex) => this.typePick(itemValue)}
                    >
                      {this.state.typeMap.map((item, index) =>
                        <Picker.Item key={index} label={item.uraianType} value={item.id} />
                      )}
                    </Picker>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>Slot</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput onChangeText={value => this.handleChange('slot', value)} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>Row</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput onChangeText={value => this.handleChange('row', value)} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                    <Text>Tier</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput onChangeText={value => this.handleChange('tier', value)} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', display: this.state.updateCari ? "flex" : "none" }}>
                    <Button
                      onPress={this.handleEdit}
                      title="Edit"
                      color="#841584"
                      accessibilityLabel="Edit"
                    />
                  </View>
                  <View style={{ flex: 1, justifyContent: "flex-start", flexDirection: 'row', left: 10 }}>
                    <Button
                      onPress={this.batal}
                      title="Cancel"
                      color="#841584"
                      accessibilityLabel="Cancel"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: '#FFF', flex: 1, display: this.state.edit ? "flex" : "none" }}>
          <View >
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              {/* <TextInput style={{ backgroundColor: '#FFF' }} placeholder="Search" onChangeText={value => this.handlingSearch('search', value)} /> */}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>No. Container</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput placeholder="Masukkan No. Container" onChangeText={value => this.handleChange('number', value)} />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>Size</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={this.state.sizePick}
                  style={{ height: 50, width: 150 }}

                  onValueChange={(itemValue, itemIndex) => this.sizePick(itemValue)}
                >
                  {this.state.sizeMap.map((item, index) =>
                    <Picker.Item key={index} label={item.size.toString()} value={item.id} />
                  )}
                </Picker>
              </View>
            </View>
            <View style={{ flexDirection: 'row', display: this.state.edit ? "flex" : "none" }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>Type</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={this.state.typePick}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue, itemIndex) => this.typePick(itemValue)}
                >
                  {this.state.typeMap.map((item, index) =>
                    <Picker.Item key={index} label={item.uraianType} value={item.id} />
                  )}
                </Picker>
              </View>
            </View>
            <View style={{ flexDirection: 'row', display: this.state.edit ? "flex" : "none" }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>Slot</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput onChangeText={value => this.handleChange('slot', value)} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', display: this.state.edit ? "flex" : "none" }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>Row</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput onChangeText={value => this.handleChange('row', value)} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', display: this.state.edit ? "flex" : "none" }}>
              <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <Text>Tier</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput onChangeText={value => this.handleChange('tier', value)} />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                <Button
                  onPress={this.handleSubmit}
                  title="Save"
                  color="#841584"
                  accessibilityLabel="Save"
                />
              </View>
              <View style={{ flex: 1, justifyContent: "flex-start", flexDirection: 'row', left: 10 }}>
                <Button
                  onPress={this.batal}
                  title="Cancel"
                  color="#841584"
                  accessibilityLabel="Cancel"
                />
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  handleEdit = async () => {
    let data = {
      "No_Container": this.state.number,
      "Size": this.state.sizePick,
      "Type": this.state.typePick,
      "slot": this.state.slot,
      "Row": this.state.row,
      "Tier": this.state.tier,
    }

    console.log(data, 'submit')
    await axios.patch(`http://192.168.1.4:3000/v1/update/${this.state.typing3}`, data).then((body) => {
      ToastAndroid.show("Data Berhasil Dirubah", ToastAndroid.SHORT)
      this.setState({
        number: '',
        sizePick: '',
        typePick: '',
        slot: '',
        row: '',
        tier: '',
        createShow: false,
        edit: false,
        delete: false
      })
    })
  }

  handleSubmit = async () => {
    let data = {
      "No_Container": this.state.number,
      "Size": this.state.sizePick,
      "Type": this.state.typePick,
      "slot": this.state.slot,
      "Row": this.state.row,
      "Tier": this.state.tier,
    }

    console.log(data, 'submit')
    await axios.post(`http://192.168.1.4:3000/v1/post`, data).then((body) => {
      ToastAndroid.show("Data Berhasil Ditambahkan", ToastAndroid.SHORT)
      this.setState({
        number: '',
        sizePick: '',
        typePick: '',
        slot: '',
        row: '',
        tier: '',
        createShow: false,
        edit: false,
        delete: false
      })
    })
  }
  render() {
    const state = this.state;
    console.log(this.state.tableData, 'inidaatas')
    return (
      <>
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
          <View style={{ backgroundColor: '#0092CD', paddingTop: 10, paddingBottom: 10, flexDirection: 'row', paddingHorizontal: 10 }}>
            <Text>DryPort</Text>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 20, top: 10 }}>
            <View style={{ flex: 2, flexDirection: 'row' }}>
              <Icon name="search" style={{ fontSize: 15, textAlignVertical: 'center' }} />
              <TextInput style={{ backgroundColor: '#FFF' }} placeholder="Search" onChangeText={value => this.handlingSearch('search', value)} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
              <TouchableHighlight onPress={this.showMenu} style={{ backgroundColor: '#FFF' }}>
                <Icon name="align-justify" style={{ fontSize: 30, textAlignVertical: 'center' }} />
              </TouchableHighlight>
              <Menu
                ref={this.setMenuRef}
              >
                <MenuDivider />
                <MenuItem onPress={this.editShow}><Text></Text>Create</MenuItem>
                <MenuItem onPress={this.updateShow}>Edit</MenuItem>
                <MenuItem onPress={this.deleteShow}>Delete</MenuItem>
                <MenuDivider />
              </Menu>
            </View>
          </View>
          <View style={{ paddingVertical: 20, marginHorizontal: 10, height: 200 }}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
              <ScrollView>
                <Rows data={state.tableData} textStyle={styles.text} />
              </ScrollView>
            </Table>
          </View>
        </View>
        {this.New()}
        {this.delete()}
        {/* <View style={{ flex: 1 }}>
        </View>
        
        </View> */}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

export default App;