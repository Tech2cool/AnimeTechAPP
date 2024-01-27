import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {ThemeColors} from '../Utils'

const color = ThemeColors.DARK;
const Pagination = ({ myPage, setMyPage, fetchAnime, title = "", search = false }) => {

  const handlePagination = (page, index = 0) => {
    if (page === "...") {
      const nextPage = myPage.availPages.find((pg, i) => {
        if (i === index + 1) {
          return pg
        }
      })
      // console.log(nextPage-1)
      if (search) {
        fetchAnime(title, nextPage - 1)
        setMyPage(prev => ({ ...prev, currentPage: nextPage - 1 }))
      } else {
        fetchAnime(nextPage - 1)
        setMyPage(prev => ({ ...prev, currentPage: nextPage - 1 }))
      }

    } else {
      if (page > myPage.totalPage || page < 1) return;
      // fetchAnime(page)
      if (search) {
        fetchAnime(title, page)
        setMyPage(prev => ({ ...prev, currentPage: page, }))
      } else {
        fetchAnime(page)
        setMyPage(prev => ({ ...prev, currentPage: page, }))
      }
    }
  }

  return (
    <View style={styles.BtnContainer}>
      {
        myPage.totalPage > 1 && myPage.currentPage > 1 && (
          <TouchableOpacity
            style={styles.myBtn}
            onPress={() => handlePagination(myPage.currentPage - 1)}
          >
            <Text style={styles.buttonText}>Prev</Text>
          </TouchableOpacity>
        )
      }
      <View style={[{ flexDirection: "row", gap: 5 }]}>
        {
          myPage?.availPages?.map((pg, i) => (
            <TouchableOpacity
              key={i}
              style={{
                borderRadius: 50,
                backgroundColor: myPage.currentPage === pg ? color.AccentBlue : undefined,
                width: 25,
                height: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => handlePagination(pg, i)} >
              <Text style={{
                color: color.White,
                fontSize: 15,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>{pg}</Text>
            </TouchableOpacity>
          ))
        }

      </View>
      {
        myPage.totalPage > 1 && myPage.currentPage < myPage.totalPage &&
        (<TouchableOpacity
          style={styles.myBtn}
          onPress={() => handlePagination(myPage.currentPage + 1)}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>)
      }
    </View>
  )
}
const styles = StyleSheet.create({
  BtnContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  currentPage: {
    borderRadius: 99,
    backgroundColor: color.DarkBackGround,
    borderWidth: 5,
    borderColor: color.White,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  myBtn: {
    paddingVertical: 5,
    // flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myBtn2: {
    // paddingVertical: 5,
    // padding: 5,
    // flex: 1,
    // paddingHorizontal: 5,
    backgroundColor: '#3498db',
    // borderRadius: 8,
    // gap:5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

})

export default Pagination