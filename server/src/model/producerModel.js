import { query } from '../dbconnection/index.js';

export const getProducerList = async () => {
  const { rows } = await query(
    `select p.producerid ,p."name",  p.city, p.country, p.logo,  p.special  from producer p order by p."name";`,
  );
  return rows;
};

export const getByName = async (prodName) => {
  const { rows } = await query(`select p.producerid, p."name" from producer p where p."name"=$1;`, [prodName]);
  return rows[0];
};

export const getProducerDetail = async (pid) => {
  const { rows } = await query(
    `
    select p.*, json_agg(  json_build_object(
      'label', prod."label" ,
      'image', prod.image ,
      'handlingunit', prod.handlingunit,
      'sellprice', prod.sellprice,
      'isbio', pc.isbio,
      'pcid', prod.pcid,
      'pcimage', pc.image
    ) ) as products from producer p 
join producerproduct pp on p.producerid = pp.producerid 
join product prod on pp.productid  = prod.productid  
join productcategory pc on prod.pcid = pc.pcid
where p.producerid  =$1
group by p.producerid ; `,
    [pid],
  );
  return rows;
};
