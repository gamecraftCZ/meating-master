from RecordingsManager import User


class Interruption:
    recording_id = 0

    def __init__(self, start_timestamp, end_timestamp, from_user, to_user):
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp
        self.from_user = from_user
        self.to_user = to_user


class Record:
    def __init__(self, user_info, start_timestamp, end_timestamp):
        self.user_info = user_info
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp


users = []
interruptions = []
records = []


def newUserRecord(user_info, start_timestamp, end_timestamp):
    user = None
    for i in users:
        if i.id == user_info.id:
            user = i
    if user is None:
        user = User(user_info.id, user_info.name)
        users.append(user)

    user.speak_time += end_timestamp - start_timestamp

    for record in records:
        if getOverlap([record.start_timestamp, record.end_timestamp], [start_timestamp, end_timestamp]) > 100:
            start = min(record.start_timestamp, start_timestamp) - 2000
            end = max(record.end_timestamp, end_timestamp) + 2000
            if start_timestamp < record.start_timestamp:
                interruptions.append(
                    Interruption(start, end, record.user_info, user_info))
            else:
                interruptions.append(
                    Interruption(start, end, user_info, record.user_info))
            # TODO call method getInterruptionRecording(startTimestamp: int, endTimestamp: int)

    records.append(Record(user_info, start_timestamp, end_timestamp))


def getOverlap(a, b):
    return max(0, min(a[1], b[1]) - max(a[0], b[0]))
