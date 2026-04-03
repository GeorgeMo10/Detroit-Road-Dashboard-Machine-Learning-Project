WITH Mode_Calculation AS (
    SELECT 
        SURFACE, 
        AS_OF_25, 
        COUNT(*) as frequency,
        ROW_NUMBER() OVER (PARTITION BY SURFACE ORDER BY COUNT(*) DESC) as rank
    FROM all_pavement
    WHERE STRNAME != 'STRNAME'
    GROUP BY SURFACE, AS_OF_25
)
SELECT 
    p.SURFACE,
    COUNT(*) AS Total_Segments,
    m.AS_OF_25 AS Mode_Score,
    ROUND(AVG(p.AS_OF_25), 2) AS Mean_Score,
    ROUND(SQRT(AVG(p.AS_OF_25 * p.AS_OF_25) - AVG(p.AS_OF_25) * AVG(p.AS_OF_25)), 2) AS Std_Deviation
FROM all_pavement p
JOIN Mode_Calculation m ON p.SURFACE = m.SURFACE AND m.rank = 1
GROUP BY p.SURFACE;