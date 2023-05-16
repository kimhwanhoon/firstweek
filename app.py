from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

import requests

from pymongo import MongoClient
 #"mongodb+srv://khh:LwE8KlTJpoo7Peua@test.ohpap5n.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(
    "mongodb+srv://sparta:test@cluster0.8bt9azj.mongodb.net/?retryWrites=true&w=majority"
)
# db = client.firstweekDB
db = client.dbsparta

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/userinfo", methods=["POST"])
def user_post():
    dropdown1 = request.form.get("dropdown1")
    dropdown2 = request.form.get("dropdown2")
    messageTextArea = request.form.get("messageTextArea")

    doc = {
        "dropdown1": dropdown1,
        "dropdown2": dropdown2,
        "messageTextArea": messageTextArea,
    }
    db.userinfo.insert_one(doc)

    return jsonify({"msg": "저장 완료!"})


@app.route("/userinfo", methods=["GET"])
def userinfo_get():
    users = list(db.userinfo.find({}, {"_id": False}))
    return jsonify({"users": users})

@app.route("/userinfo", methods=["DELETE"])
def userinfo_delete():
    dropdown1_receive = request.form.get('dropdown1_give')

    if dropdown1_receive:
        db.userinfo.delete_one({'dropdown1': dropdown1_receive})
        return jsonify({'msg': '삭제완료!'})
    else:
        return jsonify({'msg': '삭제 실패: 잘못된 값이 전달되었습니다.'})

@app.route("/userinfo", methods=["UPDATE"])
def userinfo_update():
    dropdown1_receive = request.form.get('dropdown1_give')
    edit_dropdown1_receive = request.form.get('edit_dropdown1_give')
    edit_dropdown2_receive = request.form['edit_dropdown2_give']
    edit_messageTextArea = request.form.get("edit_messageTextArea_give")

    result = db.userinfo.update_one({'dropdown1': dropdown1_receive}, {'$set': {
        'dropdown1':  edit_dropdown1_receive,
        'dropdown2': edit_dropdown2_receive,
        'messageTextArea': edit_messageTextArea
    }})

    if result.modified_count > 0:
        return jsonify({'msg': '수정완료!'})
    else:
        return jsonify({'msg': '수정 실패!'})

if __name__ == "__main__":
    app.run("0.0.0.0", port=5001, debug=True)
