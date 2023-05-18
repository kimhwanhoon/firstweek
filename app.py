from flask import Flask, render_template, request, jsonify
from bson.objectid import ObjectId
app = Flask(__name__)

import requests
import random
import sys

from pymongo import MongoClient
 #"mongodb+srv://khh:LwE8KlTJpoo7Peua@test.ohpap5n.mongodb.net/?retryWrites=true&w=majority" //환훈님 DB
 #"mongodb+srv://sparta:test@cluster0.8bt9azj.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(
     "mongodb+srv://sparta:test@cluster0.8bt9azj.mongodb.net/?retryWrites=true&w=majority"
)
# db = client.firstweekDB //환훈님 DB
# db = client.dbsparta
db = client.dbsparta

@app.route("/")
def home():
    return render_template("index.html")

#DB에 메세지 저장하는 코드 파이썬에서는 Math.random() 대신에 random.random()함수 사용
@app.route("/userinfo", methods=["POST"])
def user_post():
    id = random.random()
    password = request.form.get("password")
    dropdown1 = request.form.get("dropdown1")
    dropdown2 = request.form.get("dropdown2")
    messageTextArea = request.form.get("messageTextArea")
    print(type(id),file=sys.stderr)
    doc = {
        "id" : id,
        "password" : password,
        "dropdown1": dropdown1,
        "dropdown2": dropdown2,
        "messageTextArea": messageTextArea
    }
    db.userinfo.insert_one(doc)

    return jsonify({"msg": "저장 완료!"})

#정보 불러오는 코드
@app.route("/userinfo", methods=["GET"])
def userinfo_get():
    users = list(db.userinfo.find({}, {"_id": False}))
    return jsonify({"users": users})

# #DELETE 부분 이게 db에 저장될때는 String 으로 들어가고 id값은 float이라 강제 형변환시켜서 해결됐습니다!
#DELETE 부분 비밀번호 검증 추가
@app.route("/userinfo", methods=["DELETE"])
def userinfo_delete():
    id_receive = request.form.get('id')
    password_receive = request.form.get('password')

    print(type(id_receive), file=sys.stderr)
    
    if id_receive and password_receive:
        user = db.userinfo.find_one({'id': float(id_receive)})
        if user and user['password'] == password_receive:
            db.userinfo.delete_one({'id': float(id_receive)})
            return jsonify({'msg': '삭제 완료!'})
        else:
            return jsonify({'msg': '비밀번호가 일치하지 않습니다.'})
    else:
        return jsonify({'msg': '삭제 실패: 잘못된 값이 전달되었습니다.'})

#UPDATE 부분
@app.route("/userinfo", methods=["UPDATE"])
def userinfo_update():
    id_receive = request.form.get('id_give')
    password_receive = request.form.get('password')
    edit_dropdown1_receive = request.form.get('edit_dropdown1_give')
    edit_dropdown2_receive = request.form['edit_dropdown2_give']
    edit_messageTextArea = request.form.get("edit_messageTextArea_give")
    
    if id_receive and password_receive:
        user = db.userinfo.find_one({'id': float(id_receive)})
        if user and user['password'] == password_receive:
            result = db.userinfo.update_one({'id': float(id_receive)}, {'$set': {
                'dropdown1': edit_dropdown1_receive,
                'dropdown2': edit_dropdown2_receive,
                'messageTextArea': edit_messageTextArea
            }})
            if result.modified_count > 0:
                return jsonify({'msg': '수정 완료!'})
            else:
                return jsonify({'msg': '수정 실패!'})
        else:
            return jsonify({'msg': '비밀번호가 일치하지 않습니다.'})
    else:
        return jsonify({'msg': '수정 실패: 잘못된 값이 전달되었습니다.'})

@app.route("/check_password", methods=["POST"])
def check_password():
    data = request.get_json()
    id = data['id']
    password = data['password']

    # 데이터베이스에서 해당 ID의 사용자와 비밀번호 확인
    user = db.userinfo.find_one({'id': float(id)})
    if user and user['password'] == password:
        return jsonify({'msg': '일치'})
    else:
        return jsonify({'msg': '불일치'})

if __name__ == "__main__":
    app.run("0.0.0.0", port=5001, debug=True)

