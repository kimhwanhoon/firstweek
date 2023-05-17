from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://khh:LwE8KlTJpoo7Peua@test.ohpap5n.mongodb.net/?retryWrites=true&w=majority"
)
db = client.firstweekDB


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


# 수정하기


if __name__ == "__main__":
    app.run("0.0.0.0", port=5001, debug=True)