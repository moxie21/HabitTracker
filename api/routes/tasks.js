const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQL667',
    database: 'habit_tracker'
});

conn.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log(conn);
});

Date.prototype.toLocalDateTime = function toLocalDateTime() {
    const ten = i => (i < 10 ? '0' : '') + i;
    const YYYY = this.getFullYear();
    const MM = ten(this.getMonth() + 1);
    const DD = ten(this.getDate());
    const HH = ten(this.getHours());
    const II = ten(this.getMinutes());
    const SS = ten(this.getSeconds());

    return `${YYYY}-${MM}-${DD}T${HH}:${II}:${SS}`;
}

module.exports = function(app) {
    app.get('/api/tasks/:startDate/:endDate', function(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        let { startDate, endDate } = req.params;
        let datesArray = [];
        let sqlSubQuery = '';
        let tempDate = new Date(parseInt(startDate));
        endDate = new Date(parseInt(endDate));

        
        while (tempDate <= endDate) {
            datesArray.push(tempDate.toLocalDateTime());
            tempDate.setDate(tempDate.getDate() + 1);
        }

        let len = datesArray.length;

        datesArray.forEach((date, index) => {
            sqlSubQuery += `SELECT '${date}' AS DATE_PARAM\n`;
            if(index !== len-1) {
                sqlSubQuery += 'UNION\n';
            }
        });

        const sqlQuery = `SELECT 
                DATE_PARAM AS Date,
                Name,
                Description,
                IFNULL(Status, 0) AS Status
        FROM (
                SELECT src.DATE_PARAM,
                        task.ID,
                        task.Name,
                        task.Description
                FROM (
                        SELECT DATE_PARAM,
                                YEAR(DATE_PARAM)                            AS REPEAT_YEAR_PARAM,
                                MONTH(DATE_PARAM)                           AS REPEAT_MONTH_PARAM,
                                DAY(DATE_PARAM)                             AS REPEAT_DAY_PARAM,
                                FLOOR((DAYOFMONTH(DATE_PARAM) - 1) / 7) + 1 AS REPEAT_WEEK_PARAM,
                                WEEKDAY(DATE_PARAM) + 1                     AS REPEAT_WEEKDAY_PARAM
                        FROM (
                            ${sqlSubQuery}
                        ) date_src
                    ) src,
                    task
                        INNER JOIN tasks_meta AS tm ON tm.TaskID = task.ID
                WHERE (DATEDIFF(DATE_PARAM, StartDate) % RepeatInterval = 0)
                    OR (
                        (RepeatYear = REPEAT_YEAR_PARAM OR RepeatYear = '*')
                        AND (RepeatMonth = REPEAT_MONTH_PARAM OR RepeatMonth = '*')
                        AND (RepeatDay = REPEAT_DAY_PARAM OR RepeatDay = '*')
                        AND (RepeatWeek = REPEAT_WEEK_PARAM OR RepeatWeek = '*')
                        AND (RepeatWeekday = REPEAT_WEEKDAY_PARAM OR RepeatWeekday = '*')
                        AND StartDate <= DATE_PARAM
                    )
            ) main_src
                LEFT JOIN tasks ON (tasks.TaskID = main_src.ID AND tasks.Date = main_src.DATE_PARAM)
        ORDER BY Name, DATE_PARAM;`;
        
        conn.query(sqlQuery, function (err, data) {
            if (err) throw err;
            res.json({data});
        });
    });

};