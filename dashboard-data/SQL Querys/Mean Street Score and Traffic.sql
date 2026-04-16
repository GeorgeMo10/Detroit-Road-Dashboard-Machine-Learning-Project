WITH traffic_summary AS (
    SELECT 
        street_name, 
        ROUND(AVG(num_aadt), 2) AS avg_daily_traffic,
        MAX(num_aadt) AS peak_daily_traffic
    FROM traffic_volume
    GROUP BY street_name
),
pavement_summary AS (
    SELECT 
        STRNAME,
        ROUND(AVG(AS_OF_25), 2)AS Mean_Score
    FROM all_pavement
    WHERE RAMPID IS NULL
    GROUP BY STRNAME
)

SELECT 
    p.STRNAME,
    p.Mean_Score,
    t.avg_daily_traffic,
	t.peak_daily_traffic
FROM pavement_summary p
LEFT JOIN traffic_summary t 
    ON TRIM(UPPER(p.STRNAME)) = TRIM(UPPER(t.street_name))
WHERE t.avg_daily_traffic IS NOT NULL