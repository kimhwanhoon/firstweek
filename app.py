from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import certifi
from bson.objectid import ObjectId

app = Flask(__name__)

ca = certifi.where()
client = MongoClient('mongodb+srv://sparta:test@cluster0.8bt9azj.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
	return render_template('Introduce.html')

# 작성 내용 서버에 저장
@app.route("/info/create", methods=["POST"])
def info_post():
    to_receive = request.form['to']
    by_receive = request.form['by']
    comment_receive = request.form['comment']

    doc = {
        'to':to_receive,
		'by':by_receive,
        'comment':comment_receive
    }

    db.info.insert_one(doc)

    return jsonify({'msg':'발신완료!'})

# 서버에서 내용을 GET 해와서 디스플레이
@app.route("/info", methods=["GET"])
def info_get():
	all_stores = list(db.info.find({},{'_id':False}))
	return jsonify({'messages':all_stores})

# 서버에서 내용을 삭제
@app.route("/info/delete", methods=["DELETE"])
def info_delete():
    message_id = request.args.get('id')
    
    if message_id:
        db.info.delete_one({'_id': ObjectId(message_id)})
        return jsonify({'msg': '삭제완료!'})
    else:
        return jsonify({'msg': '삭제 실패: 잘못된 ID값이 입력되었습니다.'})

if __name__ == '__main__':
	app.run('0.0.0.0', port=5001, debug=True)