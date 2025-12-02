import { query } from '../dbconnection/index.js';

export const getProductDetailByName = async (pname) => {
  const { rows } = await query(
    `select p.label, p.productid, p.kgperunit, p.sellprice, p2.mintemp, p2.maxtemp, p2.minhumidity, p2.minquality  from product p join productcategory p2 on p.pcid = p2.pcid where p.label=$1;`,
    [pname],
  );
  return rows[0];
};

// general overiew of products
export const getProductOverview = async () => {
  const { rows } = await query(
    `with productinfo as (
select p.productid, COALESCE(sum(s.unitscount),0) as totalcount, coalesce(sum(s.unitscount *b.buyprice)/sum(s.unitscount),0) as avgbuyprice from product p
left join batchitem b on p.productid = b.productid
left join slotentry s on b.biid = s.biid
 group by p.productid)
select p.*, pc.image as pimage, pc.isbio, pc.label as plabel , pi.totalcount, pi.avgbuyprice from product p
JOIN productinfo pi ON pi.productid = p.productid
join productcategory pc on p.pcid = pc.pcid order by p.productid;`,
  );
  return rows;
};

/** detail data for products per country */
export const getProductOverviewPerCountry = async (country) => {
  const { rows } = await query(
    `WITH city_sums AS (
  SELECT 
    p.productid,
    w.city,
    coalesce(SUM(s.unitscount),0) AS totalunits
  FROM product p
  left JOIN batchitem b ON p.productid = b.productid
  left JOIN slotentry s ON b.biid = s.biid
  left JOIN slot sl ON s.slid = sl.slid
  left JOIN storage sto ON sl.storageid = sto.storageid
  left JOIN warehouse w ON sto.wid = w.wid
  left JOIN site site ON w.siteid = site.siteid
  WHERE site.country = $1
  GROUP BY p.productid, w.city
)
SELECT 
  p.*, pc.image as pimage, pc.isbio, pc.label as plabel,
  coalesce(sum(cs.totalunits),0) as sumunits,
json_agg(
  json_build_object('city', cs.city, 'totalunits', cs.totalunits)
  ORDER BY cs.totalunits DESC
) FILTER (WHERE cs.city IS NOT NULL) AS city_data
FROM product p
join productcategory pc on pc.pcid  = p.pcid
left JOIN city_sums cs ON cs.productid = p.productid
GROUP BY p.productid, pc.pcid order by p.productid;`,
    [country],
  );
  return rows;
};

export const getProductOverviewPerCity = async (city) => {
  const { rows } = await query(
    `SELECT 
    p.productid,
    p.label as plabel,
   pc.image as pimage, pc.isbio, pc.label as pclabel,
   sum(se.unitscount) as totalcount,
   w.*,
   json_agg(
   json_build_object('slid', se.slid,'slotentryid', se.slotentryid, 'chargeid', bi.chargeid, 'biid', se.biid, 'unitscount', se.unitscount,'storageid', sto.storageid) )
   AS slots
  FROM product p
  join productcategory pc on pc.pcid  = p.pcid
  JOIN batchitem bi ON p.productid = bi.productid
  JOIN slotentry se ON bi.biid = se.biid
  JOIN slot sl ON se.slid = sl.slid
  JOIN storage sto ON sl.storageid = sto.storageid
  JOIN warehouse w ON sto.wid = w.wid
  and w.city = $1
  group by w.wid, p.productid, pc.pcid
 order by p.productid ;`,
    [city],
  );
  return rows;
};
