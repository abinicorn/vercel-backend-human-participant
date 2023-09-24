import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const studySchema = new Schema({
    studyCode: {type: String, required: true, unique: true},
    studyName: String,
    description: String,
    creator: {type: Schema.Types.ObjectId, ref: 'Researcher'},
    researcherList:[{type: Schema.Types.ObjectId, ref: 'Researcher'}],
    studyType: String,
    participantNum: Number,
    recruitmentStartDate: Date,
    recruitmentCloseDate: Date,
    location:[String],
    isClosed: {type: Boolean, default: false},
    surveyLink: String,
    driveLink: String

}, {
    timestamps: {}
});

const Study = mongoose.model('Study', studySchema, 'Study');

export default Study;