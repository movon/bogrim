from __future__ import print_function

import boto3
import botocore
import json
import re
import mysql.connector

#print('Loading function')

def real_to_fake(real_email, con):
    #stuff with db
    #replace fake_email's value with the value extracted from the db
    #fake_email = "danieleliad@kfar-yedidim.com"#just for now
    cur = con.cursor()
    query = "SELECT FakeEmail FROM Users WHERE RealEmail=%s"
    params = (real_email,)
    cur.execute(query, params)
    fake_email = list(cur)[0][0]
    cur.close()
    return fake_email
def full_real_to_fake(real_email, con):
    addr = real_email[real_email.index("<")+1:real_email.index(">",real_email.index("<"))]
    return real_email[:real_email.index("<")] + "<" + real_to_fake(addr, con) + ">"
def fake_to_real(fake_email, con):
    #stuff with db
    #replace real_email's value with the value extracted from the db
    #real_email = "daniel@melig.co.il"#just for now
    cur = con.cursor()
    query = "SELECT RealEmail FROM Users WHERE FakeEmail=%s"
    params = (fake_email,)
    cur.execute(query, params)
    real_email = list(cur)[0][0]
    cur.close()
    return real_email
def lambda_handler(event, context):
    client = boto3.client('ses')
    s3_client = boto3.client('s3')
    con = None
    try:
        con = mysql.connector.connect(user='kfarsqlyedidim', password='Movkfar25.11yarokon162015!',
                                  host='aaapn5ty4f35zv.cf7gzy2xliu4.us-west-2.rds.amazonaws.com',
                                  database='innodb')
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
        #context.fail ?
        return "Request Failed :("
    try:
        email = event["Records"][0]["ses"]["mail"]
        recipients = event["Records"][0]["ses"]["receipt"]["recipients"]
        real_sender = email["commonHeaders"]["from"][0]
        fake_sender = full_real_to_fake(real_sender, con)
        real_forward_emails = []
        for fake_email_recipient in recipients:
            real_forward_emails.append(fake_to_real(fake_email_recipient, con))
        
        key = event["Records"][0]["ses"]["mail"]["messageId"]
        data = s3_client.get_object(
            Bucket='kfar-yedidim-emails',
            Key=key
        )
        
        message = data["Body"].read()
        message = re.sub(r"^From: (.*)","From: " + fake_sender,message,flags=re.MULTILINE)
        message = re.sub(r"^Return-Path: (.*)","Return-Path: " + fake_sender[fake_sender.index("<"):fake_sender.index(">")+1], message,flags = re.MULTILINE)
        
        print(real_forward_emails)
    except Exception as e:
        print(e)
        #context.fail ?
        return "Request Failed :("
    try:
        client.send_raw_email(
            Destinations = real_forward_emails,
            RawMessage = {
                "Data": message
            },
            SourceArn = 'arn:aws:ses:us-west-2:334621821605:identity/kfar-yedidim.com'
        )
    except Exception as e:
        print(e)
    con.close()
    return "All Good"