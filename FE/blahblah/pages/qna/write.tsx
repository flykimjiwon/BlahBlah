import { Grid, Button } from "@mui/material";
import Image from "next/image";
export default function QnaWrite() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={2} />
      <Grid item xs={8}>
        <Image
          src="/images/notice.PNG"
          alt="notice2 image"
          width="200"
          height="40"
          layout="responsive"
        />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3 className="text-center">제목</h3>
          </Grid>
          <Grid item xs={9}>
            <textarea
              placeholder="제목을 입력해주세요."
              style={{ width: "80%" }}
            />
          </Grid>
        </Grid>
        <br></br>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3 className="text-center">문의 내용</h3>
          </Grid>
          <Grid item xs={9}>
            <textarea
              placeholder="문의 내용을 작성해주세요"
              style={{ minHeight: 300, width: "80%" }}
            />
          </Grid>
        </Grid>
        <br></br>
        <br></br>
        <div className="m">
          <Button variant="contained" disabled>
            취소
          </Button>{" "}
          <Button variant="contained">작성</Button>
        </div>
        <Grid item xs={2} />
      </Grid>
      <style jsx>
        {`
          .m {
            width: 200px;
            margin: 0 auto;
          }
        `}
      </style>
    </Grid>
  );
}