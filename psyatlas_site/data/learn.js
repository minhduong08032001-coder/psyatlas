/* Chương trình học. Mỗi bài: mục tiêu, việc cần đọc (giáo trình + trang in), mục cần học trong PsyAtlas,
   ý chính, lỗi hay gặp, nối với thực hành và bài tự kiểm tra.
   Câu hỏi: q = đề, ok = đáp án đúng, no = 3 đáp án nhiễu, why = giải thích. Thứ tự đáp án được xáo mỗi lần làm. */
(function () {
  var P2 = window.PSY.P2, NB = window.PSY.NB;
  function R(src, why, extra) { src.why = why; src.extra = !!extra; return src; }
  function Q(q, ok, no, why, ref) { return { q: q, ok: ok, no: no, why: why, ref: ref || [] }; }

  window.PSY.learn = {
    stages: [
      {
        id: "s1", title: "Giai đoạn 1 · Kiến thức nền tảng", months: "Tháng 1–3 (8/2026 – 10/2026)", ready: true,
        goal: "Hiểu tâm lý học là một ngành khoa học, nắm nền tảng thần kinh học và cơ chế học – nhớ – tư duy, đủ để đọc tiếp các phần phát triển, nhân cách và tâm bệnh học.",
        modules: [
          {
            id: "m1", title: "Nhập môn và tư duy khoa học", month: "Tháng 1", lessons: [
              {
                id: "l1", title: "Tâm lý học là gì, từ đâu tới và làm nghề gì", minutes: 150,
                goals: ["Kể được các trường phái chính và câu hỏi mỗi trường phái đặt ra", "Phân biệt nhà tâm lý lâm sàng, bác sĩ tâm thần và các vai trò gần nghề", "Giải thích mô hình sinh học – tâm lý – xã hội bằng một ví dụ"],
                read: [R(P2("1.1", 8), "Định nghĩa và phạm vi"), R(P2("1.2", 9), "Wundt, James, Freud, Watson, Skinner, nhân văn"), R(P2("1.3", 18), "Các nhánh hiện đại"), R(P2("1.4", 26), "Nghề nghiệp, quan trọng cho định hướng của bạn")],
                study: ["t-schools", "t-biopsychosocial", "t-careers", "t-psychoanalysis", "t-unconscious", "t-humanistic-self", "t-dsm-icd"],
                keys: ["Mỗi trường phái trả lời một câu hỏi khác nhau, không có trường phái \"đúng tuyệt đối\".", "Wundt (1879, Leipzig) thường được xem là mốc khai sinh tâm lý học thực nghiệm.", "Hành vi học loại bỏ nội quan, chỉ giữ hành vi quan sát được; cuộc cách mạng nhận thức đưa quá trình tinh thần trở lại.", "Mô hình sinh học – tâm lý – xã hội là khung chung của lâm sàng hiện đại."],
                pitfalls: ["Nhầm cấu trúc (tìm thành phần của tâm trí) với chức năng (tâm trí giúp thích nghi ra sao).", "Cho rằng phân tâm học là toàn bộ tâm lý học."],
                practice: "Khi nghe một ca, thử nhìn từ ba tầng: cơ thể, suy nghĩ và cảm xúc, hoàn cảnh xã hội. Đó là thói quen nền của người làm lâm sàng.",
                quiz: [
                  Q("Người thường được gắn với việc lập phòng thí nghiệm tâm lý ở Leipzig năm 1879 là ai?", "Wilhelm Wundt", ["Sigmund Freud", "John B. Watson", "Carl Rogers"], "Phòng thí nghiệm của Wundt ở Leipzig (1879) là mốc thường được dùng để đánh dấu sự ra đời của tâm lý học thực nghiệm.", ["t-schools"]),
                  Q("Trường phái nào cho rằng tâm lý học chỉ nên nghiên cứu hành vi quan sát được và bác bỏ nội quan?", "Hành vi học (behaviorism)", ["Chủ nghĩa cấu trúc", "Phân tâm học", "Tâm lý học nhân văn"], "Watson và Skinner đại diện cho hành vi học, tập trung vào hành vi đo được và tác động của môi trường.", ["t-schools"]),
                  Q("Điểm khác cơ bản giữa chủ nghĩa cấu trúc và chủ nghĩa chức năng là gì?", "Cấu trúc tìm các thành phần của tâm trí; chức năng hỏi tâm trí giúp con người thích nghi như thế nào", ["Cấu trúc nghiên cứu hành vi; chức năng nghiên cứu vô thức", "Cấu trúc dùng thực nghiệm; chức năng chỉ dùng quan sát thiên nhiên", "Cấu trúc nhấn mạnh tiềm năng con người; chức năng nhấn mạnh điều kiện hóa"], "Titchener (cấu trúc) tìm các yếu tố cấu thành trải nghiệm; James (chức năng) quan tâm vai trò thích nghi của ý thức.", ["t-schools"]),
                  Q("Theo giáo trình, khác biệt nghề nghiệp phổ biến giữa nhà tâm lý lâm sàng và bác sĩ tâm thần là gì?", "Nhà tâm lý lâm sàng thường có bằng tiến sĩ tâm lý và làm trắc nghiệm; bác sĩ tâm thần có bằng y khoa và có thể kê đơn", ["Bác sĩ tâm thần không được phép điều trị bằng lời nói, chỉ được phép dùng thuốc", "Nhà tâm lý lâm sàng luôn kê đơn thuốc, còn bác sĩ tâm thần thì không bao giờ kê", "Hai nghề giống nhau hoàn toàn về đào tạo và chỉ khác nhau về tên gọi"], "Quy định cụ thể (kể cả quyền kê đơn) khác nhau theo từng nước, nên hãy kiểm tra luật tại nơi bạn hành nghề.", ["t-careers"]),
                  Q("Một thân chủ bị trầm cảm. Nhà trị liệu xem xét yếu tố gen, việc mới mất việc và cách người đó tự nhận định về bản thân. Cách tiếp cận này thuộc mô hình nào?", "Sinh học – tâm lý – xã hội", ["Chỉ y sinh học", "Chỉ hành vi học", "Chỉ phân tâm học"], "Mô hình sinh học – tâm lý – xã hội xét đồng thời cơ thể, suy nghĩ/cảm xúc và hoàn cảnh sống.", ["t-biopsychosocial"])
                ]
              },
              {
                id: "l2", title: "Cách khoa học tìm ra câu trả lời: giả thuyết, thiết kế, tương quan và nhân quả", minutes: 150,
                goals: ["Phân biệt tương quan và nhân quả", "Chỉ ra được biến độc lập, phụ thuộc, nhóm chứng và biến gây nhiễu trong một ví dụ", "Giải thích vì sao cần mẫu ngẫu nhiên và thiết kế mù"],
                read: [R(P2("2.1", 36), "Vì sao cần nghiên cứu, thiên kiến nhận thức"), R(P2("2.2", 41), "Các thiết kế nghiên cứu")],
                study: ["t-hypothesis", "t-operational", "t-experiment", "t-correlation", "t-confounder", "t-illusory-correlation", "t-blind", "t-sampling", "t-longitudinal", "t-placebo", "t-confirmation", "t-reliability"],
                keys: ["Chỉ thực nghiệm với phân nhóm ngẫu nhiên cho phép kết luận nhân quả.", "Tương quan nói hai biến đi cùng nhau, không nói biến nào gây ra biến nào, và có thể do yếu tố thứ ba.", "Giả thuyết khoa học phải có khả năng bị bác bỏ.", "Mẫu có đại diện cho quần thể thì kết quả mới tổng quát hóa được."],
                pitfalls: ["Nghĩ r âm nghĩa là \"không có tương quan\"; r = −0,8 mạnh hơn r = +0,3.", "Bỏ qua giả dược và kỳ vọng của người nghiên cứu."],
                practice: "Khi đọc một tin kiểu \"nghiên cứu cho thấy X gây ra Y\", hỏi ngay: đây là thực nghiệm hay tương quan? Có nhóm chứng không? Mẫu là ai?",
                quiz: [
                  Q("Thiết kế nghiên cứu nào cho phép đưa ra kết luận nhân quả?", "Thực nghiệm có phân nhóm ngẫu nhiên", ["Khảo sát bằng bảng hỏi trên mẫu lớn", "Nghiên cứu tương quan với mẫu lớn", "Quan sát tự nhiên kéo dài nhiều năm"], "Chỉ khi nhà nghiên cứu thao tác biến độc lập và phân ngẫu nhiên, các nhóm mới tương đương ban đầu, nên chênh lệch có thể quy cho can thiệp.", ["t-experiment"]),
                  Q("Hai hệ số tương quan r = −0,8 và r = +0,3. Phát biểu nào đúng?", "r = −0,8 là mối quan hệ mạnh hơn và ngược chiều", ["r = +0,3 mạnh hơn vì dương", "r = −0,8 nghĩa là hai biến không liên quan", "Cả hai mạnh như nhau vì khác dấu thôi"], "Độ lớn (giá trị tuyệt đối) cho biết cường độ, dấu cho biết hướng. Tương quan âm không phải là không có tương quan.", ["t-correlation"]),
                  Q("Doanh số kem và số vụ trộm cắp cùng tăng vào mùa hè. Cách giải thích hợp lý nhất là gì?", "Một yếu tố thứ ba như thời tiết nóng ảnh hưởng đến cả hai", ["Ăn kem khiến người ta đi trộm", "Trộm cắp làm người ta thèm kem", "Đây chắc chắn là sự trùng hợp, không cần xem xét thêm"], "Đây là ví dụ kinh điển của biến gây nhiễu: mùa hè hay thời tiết nóng làm tăng cả hai biến.", ["t-confounder"]),
                  Q("Trong nghiên cứu mù đôi, ai không biết người tham gia thuộc nhóm nào?", "Cả người tham gia lẫn người nghiên cứu/đánh giá", ["Chỉ người tham gia", "Chỉ người nghiên cứu", "Không ai, mọi người đều biết"], "Mù đôi giảm cả hiệu ứng kỳ vọng của người tham gia (giả dược) và thiên kiến của người nghiên cứu.", ["t-blind", "t-placebo"]),
                  Q("Điều kiện cốt lõi để một giả thuyết được xem là khoa học là gì?", "Có thể bị kết quả thực nghiệm bác bỏ", ["Được nhiều người tin", "Được một chuyên gia nổi tiếng đề xuất", "Luôn giải thích được mọi kết quả"], "Một giả thuyết giải thích được mọi kết quả thì không kiểm chứng được. Khả năng bị bác bỏ (falsifiability) là tiêu chí của khoa học.", ["t-hypothesis"]),
                  Q("Một nghiên cứu chỉ tuyển sinh viên năm nhất một trường đại học rồi kết luận về \"con người nói chung\". Hạn chế chính là gì?", "Mẫu không đại diện nên khó tổng quát hóa cho quần thể", ["Không thể dùng thống kê với sinh viên", "Mẫu quá lớn nên bị sai lệch", "Nghiên cứu đó không có biến độc lập"], "Kết quả chỉ tổng quát hóa được cho quần thể mà mẫu đại diện, thường cần chọn mẫu ngẫu nhiên.", ["t-sampling"])
                ]
              },
              {
                id: "l3", title: "Thống kê mô tả và đạo đức nghiên cứu", minutes: 120,
                goals: ["Tính và so sánh trung bình, trung vị, yếu vị", "Hiểu độ lệch chuẩn và hệ số tương quan", "Nêu các nguyên tắc đạo đức: đồng thuận, bảo mật, IRB, giải thích sau thí nghiệm"],
                read: [R(P2("2.3", 48), "Thống kê cơ bản, tương quan"), R(P2("2.4", 59), "Đạo đức nghiên cứu và đạo đức nghề")],
                study: ["t-descriptive-stats", "t-correlation", "t-testing", "t-ethics-research", "t-peer-review", "t-consent", "t-confidentiality", "t-sens-spec"],
                keys: ["Giá trị ngoại lai kéo trung bình mạnh hơn trung vị.", "Độ lệch chuẩn lớn nghĩa là dữ liệu phân tán rộng.", "Nghiên cứu trên người cần IRB, đồng thuận có hiểu biết và quyền rút lui.", "Bình duyệt đồng cấp giúp lọc lỗi nhưng không bảo đảm đúng tuyệt đối."],
                pitfalls: ["Dùng trung bình khi dữ liệu lệch mạnh.", "Nghĩ rằng đã có đồng thuận thì không cần giải thích sau thí nghiệm khi có lừa dối."],
                practice: "Nguyên tắc đồng thuận, bảo mật và giới hạn bảo mật ở đây chính là nền cho buổi tiếp nhận thân chủ về sau.",
                quiz: [
                  Q("Điểm của 5 người: 2, 3, 3, 4, 18. Phát biểu nào đúng?", "Yếu vị là 3, trung vị là 3 và trung bình là 6 (bị kéo lên bởi giá trị 18)", ["Trung bình là 3, trung vị là 6", "Yếu vị là 18 vì lớn nhất", "Trung bình, trung vị và yếu vị đều bằng nhau"], "Trung bình = 30/5 = 6. Trung vị (giá trị giữa) = 3. Yếu vị (gặp nhiều nhất) = 3. Giá trị ngoại lai 18 làm trung bình lệch.", ["t-descriptive-stats"]),
                  Q("Hai lớp cùng điểm trung bình 7. Lớp A có độ lệch chuẩn 0,5; lớp B có độ lệch chuẩn 2,5. Điều nào đúng?", "Điểm của lớp B phân tán rộng hơn lớp A", ["Lớp B có điểm cao hơn lớp A", "Lớp A có nhiều giá trị ngoại lai hơn", "Hai lớp có mức phân tán giống nhau vì cùng trung bình"], "Độ lệch chuẩn đo mức phân tán quanh trung bình, không đo mức cao hay thấp.", ["t-descriptive-stats"]),
                  Q("Hệ số tương quan r = 0 cho biết điều gì?", "Không có mối quan hệ tuyến tính giữa hai biến", ["Hai biến có quan hệ nhân quả hoàn hảo", "Hai biến có quan hệ ngược chiều rất mạnh", "Dữ liệu bị sai"], "r = 0 nghĩa là không có quan hệ tuyến tính; càng gần ±1 thì quan hệ càng mạnh.", ["t-correlation"]),
                  Q("Mục đích của giải thích sau thí nghiệm (debriefing) là gì?", "Cho họ biết mục đích thật, giải thích sự lừa dối và kiểm tra xem họ có bị tổn hại không", ["Thu thêm dữ liệu bổ sung cho chính nghiên cứu đó", "Bảo đảm người tham gia không kể lại cho người khác biết", "Thay thế hoàn toàn cho bước xin đồng thuận ban đầu"], "Lừa dối chỉ chấp nhận được khi thật cần thiết cho thiết kế và phải được giải thích đầy đủ sau đó.", ["t-ethics-research"]),
                  Q("Điều nào là yếu tố cốt lõi của đồng thuận có hiểu biết?", "Người tham gia biết mục đích, rủi ro, quyền rút lui và đồng ý một cách tự nguyện", ["Người tham gia ký giấy mà không cần đọc", "Chỉ cần người nghiên cứu cho là việc này có lợi", "Người tham gia không được rút lui khi đã bắt đầu"], "Đồng thuận phải dựa trên thông tin đầy đủ và tự nguyện, kể cả quyền rút lui.", ["t-consent"]),
                  Q("Bình duyệt đồng cấp (peer review) là gì?", "Chuyên gia cùng lĩnh vực thẩm định bản thảo, nhưng không bảo đảm đúng tuyệt đối", ["Cơ quan nhà nước duyệt mọi nghiên cứu trước khi được tiến hành", "Tác giả tự kiểm tra lại toàn bộ kết quả của chính mình", "Một quy trình bảo đảm rằng mọi bài báo được đăng đều đúng"], "Bình duyệt giảm lỗi nhưng vẫn có thể bỏ sót; vì thế cần lặp lại nghiên cứu và đọc phê phán.", ["t-peer-review"])
                ]
              }
            ]
          },
          {
            id: "m2", title: "Sinh học của hành vi, ý thức và tri giác", month: "Tháng 2", lessons: [
              {
                id: "l4", title: "Gen, nơ-ron và khớp thần kinh", minutes: 180,
                goals: ["Mô tả cấu trúc nơ-ron và vai trò từng phần", "Giải thích điện thế hoạt động và quy luật tất cả hoặc không có gì", "Giải thích cách thuốc tác động lên khớp thần kinh (chủ vận, đối vận, ức chế tái hấp thu)"],
                read: [R(P2("3.1", 71), "Gen và di truyền"), R(P2("3.2", 78), "Nơ-ron, tín hiệu, synapse"), R(NB("2.1", 60), "Giao tiếp thần kinh ở mức sâu hơn", true), R(NB("3.1", 125), "Nguyên tắc hóa học thần kinh", true)],
                study: ["t-genes", "t-heritability", "t-nature-nurture", "t-epigenetics", "t-neuron", "t-action-potential", "t-synapse", "n-psychopharm", "n-serotonin", "n-dopamine"],
                keys: ["Gen và môi trường cùng quyết định kiểu hình; tính di truyền là thống kê quần thể, không áp dụng cho một cá nhân.", "Nơ-ron: sợi nhánh nhận, thân tế bào tích hợp, sợi trục dẫn, đầu tận cùng phát chất dẫn truyền.", "Điện thế hoạt động theo quy luật tất cả hoặc không có gì; myelin làm dẫn truyền nhanh.", "Thuốc hướng thần tác động ở synapse: chủ vận, đối vận, ức chế tái hấp thu."],
                pitfalls: ["Hiểu \"di truyền tính 50%\" là một người có 50% do gen.", "Nghĩ rằng một chất dẫn truyền quyết định một cảm xúc (ví dụ \"serotonin là hormone hạnh phúc\")."],
                practice: "Hiểu synapse giúp bạn giải thích cho thân chủ vì sao thuốc cần vài tuần mới có tác dụng và vì sao không nên nói \"thiếu hóa chất\" một cách đơn giản.",
                quiz: [
                  Q("Con người bình thường có bao nhiêu cặp nhiễm sắc thể?", "23 cặp", ["12 cặp", "46 cặp", "32 cặp"], "Con người có 23 cặp, tức 46 nhiễm sắc thể.", ["t-genes"]),
                  Q("Phần nào của nơ-ron chủ yếu nhận tín hiệu từ các nơ-ron khác?", "Sợi nhánh (dendrite)", ["Sợi trục (axon)", "Bao myelin", "Eo Ranvier"], "Sợi nhánh nhận tín hiệu; sợi trục dẫn tín hiệu đi; myelin cách điện giúp dẫn nhanh.", ["t-neuron"]),
                  Q("\"Tất cả hoặc không có gì\" của điện thế hoạt động nghĩa là gì?", "Khi đạt ngưỡng thì xung luôn cùng kích cỡ, kích thích mạnh hơn không làm xung lớn hơn", ["Kích thích càng mạnh thì mỗi xung càng lớn hơn tương ứng", "Xung chỉ có thể xảy ra ở những sợi trục có bao myelin", "Xung luôn lan ngược trở lại về phía thân tế bào"], "Cường độ kích thích được mã hóa qua tần suất phát xung chứ không qua kích cỡ của từng xung.", ["t-action-potential"]),
                  Q("Bao myelin có vai trò chính nào?", "Cách điện, làm xung dẫn truyền nhanh hơn", ["Tiết chất dẫn truyền", "Nhận tín hiệu từ synapse", "Tạo ra năng lượng cho nơ-ron"], "Myelin có các khoảng hở (eo Ranvier), xung nhảy từ eo này sang eo khác nên nhanh hơn.", ["t-neuron"]),
                  Q("Thuốc ức chế tái hấp thu chọn lọc serotonin (SSRI) hoạt động chủ yếu bằng cách nào?", "Giữ serotonin ở lại khe synapse lâu hơn nhờ chặn tái hấp thu", ["Chặn hoàn toàn thụ thể serotonin", "Bổ sung serotonin trực tiếp vào máu", "Làm nơ-ron ngừng phát xung"], "Chặn bơm tái hấp thu làm lượng serotonin ở khe tăng lên; tác dụng lâm sàng thường chậm hơn tác dụng sinh hóa.", ["t-synapse", "n-psychopharm"]),
                  Q("Thuốc đối vận (antagonist) tác động theo cách nào?", "Gắn vào thụ thể nhưng chặn tác dụng của chất dẫn truyền", ["Bắt chước chất dẫn truyền và kích hoạt thụ thể", "Làm tăng sản xuất chất dẫn truyền", "Phân hủy thụ thể"], "Chủ vận bắt chước hoặc tăng tác dụng; đối vận chặn thụ thể.", ["t-synapse"])
                ]
              },
              {
                id: "l5", title: "Hệ thần kinh, các vùng não và nội tiết", minutes: 210,
                goals: ["Phân biệt các phân hệ thần kinh (trung ương, ngoại biên, giao cảm, phó giao cảm)", "Gắn chức năng chính với từng vùng não, nhớ tính mạng lưới", "Mô tả cách các kỹ thuật hình ảnh khác nhau về độ phân giải"],
                read: [R(P2("3.3", 84), "Các phân hệ của hệ thần kinh"), R(P2("3.4", 86), "Não, tủy sống, kỹ thuật hình ảnh"), R(P2("3.5", 97), "Nội tiết"), R(NB("1.2", 21), "Tổ chức hệ thần kinh", true), R(NB("1.4", 36), "Cấu trúc và chức năng của não", true)],
                study: ["t-nervous-divisions", "t-hemispheres", "t-neuroimaging", "t-endocrine", "n-frontal", "n-parietal", "n-temporal", "n-occipital", "n-hippocampus", "n-amygdala", "n-hypothalamus", "n-thalamus", "n-cerebellum", "n-brainstem", "n-broca", "n-wernicke", "n-hpa"],
                keys: ["Giao cảm chuẩn bị đánh hay chạy; phó giao cảm đưa cơ thể về trạng thái nghỉ.", "Hồi hải mã quan trọng với ký ức sự kiện mới; hạnh nhân gắn với phản ứng sợ và cảm xúc.", "Vùng Broca (sản xuất lời nói) và Wernicke (hiểu lời) thường ở bán cầu trái; ngôn ngữ dựa trên cả mạng lưới.", "EEG tốt về thời gian; fMRI tốt về vị trí; PET dùng chất phóng xạ, ít chi tiết."],
                pitfalls: ["\"Não trái logic, não phải sáng tạo\" là cách nói quá đơn giản.", "Một vùng = một chức năng = một rối loạn."],
                practice: "Khi thân chủ kể về triệu chứng, bạn nghĩ tới mạng lưới liên quan, không gán cho một vùng đơn lẻ, và nhớ loại trừ nguyên nhân y khoa.",
                quiz: [
                  Q("Phân hệ nào của hệ thần kinh tự chủ chuẩn bị cơ thể cho phản ứng \"đánh hay chạy\"?", "Hệ giao cảm", ["Hệ phó giao cảm", "Hệ thần kinh thân thể", "Hệ thần kinh ruột"], "Giao cảm tăng nhịp tim, nhịp thở; phó giao cảm đưa cơ thể về trạng thái nghỉ và tiêu hóa.", ["t-nervous-divisions"]),
                  Q("Cấu trúc nào đặc biệt quan trọng cho việc hình thành ký ức sự kiện mới?", "Hồi hải mã", ["Tiểu não", "Thùy chẩm", "Thân não"], "Tổn thương hồi hải mã gây khó tạo ký ức mới (mất trí nhớ thuận chiều).", ["n-hippocampus"]),
                  Q("Một người hiểu lời nói nhưng nói ngắt quãng, nặng nhọc sau đột quỵ thùy trán trái. Vùng nào gợi ý nhiều nhất?", "Vùng Broca", ["Vùng Wernicke", "Thùy chẩm", "Tiểu não"], "Tổn thương Broca gây khó sản xuất lời nói dù còn hiểu; tổn thương Wernicke gây nói trôi chảy nhưng vô nghĩa và hiểu kém.", ["n-broca", "n-wernicke"]),
                  Q("Cần biết phản ứng của não diễn ra vào thời điểm chính xác nào (mức mili-giây). Kỹ thuật nào phù hợp nhất?", "EEG", ["CT", "PET", "MRI cấu trúc"], "EEG ghi hoạt động điện qua da đầu nên rất tốt về thời gian nhưng kém định vị vùng sâu; fMRI dựa trên dòng máu nên chậm hơn.", ["t-neuroimaging"]),
                  Q("Cấu trúc nào của não điều khiển tuyến yên, nối hệ thần kinh với hệ nội tiết?", "Vùng dưới đồi", ["Đồi thị", "Tiểu não", "Hồi hải mã"], "Vùng dưới đồi điều khiển tuyến yên, tuyến này điều hòa nhiều tuyến khác.", ["n-hypothalamus", "t-endocrine"]),
                  Q("Phát biểu nào về thể chai (corpus callosum) là đúng?", "Nối hai bán cầu; nếu bị cắt thì hai bán cầu trao đổi ít hơn", ["Nối não với tủy sống để truyền tín hiệu vận động", "Chỉ có ở những người từng mắc bệnh động kinh", "Là nơi sản xuất phần lớn hormone của cơ thể"], "Thể chai gồm khoảng 200 triệu sợi trục nối hai bán cầu.", ["t-hemispheres"])
                ]
              },
              {
                id: "l6", title: "Ý thức, giấc ngủ và chất tác động tâm thần", minutes: 210,
                goals: ["Giải thích nhịp sinh học và vai trò của SCN", "Phân biệt các giai đoạn giấc ngủ", "Nêu nguyên lý dung nạp, lệ thuộc, cai"],
                read: [R(P2("4.1", 110), "Ý thức"), R(P2("4.2", 114), "Vì sao ta ngủ"), R(P2("4.3", 117), "Các giai đoạn ngủ"), R(P2("4.4", 121), "Rối loạn giấc ngủ"), R(P2("4.5", 126), "Chất tác động tâm thần"), R(P2("4.6", 134), "Thiền, thôi miên"), R(NB("15.1", 666), "Nhịp sinh học (nâng cao)", true), R(NB("15.3", 679), "Điều hòa giấc ngủ (nâng cao)", true)],
                study: ["t-consciousness", "t-circadian", "t-sleep-stages", "t-sleep-disorders", "t-substance", "t-meditation-hypnosis", "n-scn", "n-sleep-switch", "n-reward", "d-insomnia", "t-consolidation"],
                keys: ["SCN ở vùng dưới đồi là đồng hồ chủ, nhận ánh sáng từ võng mạc.", "NREM 1–3 sâu dần (sóng delta ở giai đoạn 3); REM có sóng giống lúc tỉnh, mơ nhiều, cơ liệt tương đối.", "Giấc ngủ hỗ trợ hợp nhất trí nhớ.", "Dung nạp: cần liều cao hơn; cai: triệu chứng khi ngừng sau thích nghi."],
                pitfalls: ["Cho rằng mất ngủ chỉ cần thuốc ngủ.", "Cho rằng REM là giai đoạn duy nhất có mơ."],
                practice: "Hỏi giấc ngủ là một phần bắt buộc của mọi buổi đánh giá; thay đổi giấc ngủ vừa là triệu chứng vừa là yếu tố duy trì của nhiều rối loạn.",
                quiz: [
                  Q("Cấu trúc nào đóng vai trò đồng hồ chủ của nhịp sinh học khoảng 24 giờ?", "Nhân trên chéo thị (SCN)", ["Hồi hải mã ở thùy thái dương", "Tiểu não ở phía sau đầu", "Thể chai nối hai bán cầu"], "SCN nhận tín hiệu ánh sáng từ võng mạc để đồng bộ nhịp sinh học.", ["n-scn", "t-circadian"]),
                  Q("Đặc điểm nào đúng với giấc ngủ REM?", "Sóng não giống lúc tỉnh, mắt chuyển động nhanh, cơ liệt tương đối, mơ nhiều", ["Sóng delta chậm, khó đánh thức", "Nhịp tim và thở chậm nhất trong đêm", "Là giai đoạn chuyển tiếp ngắn khi vừa nhắm mắt"], "Sóng delta là của NREM giai đoạn 3 (ngủ sâu).", ["t-sleep-stages"]),
                  Q("Sóng delta chậm là dấu hiệu nổi bật của giai đoạn nào?", "NREM giai đoạn 3 (ngủ sâu)", ["REM", "NREM giai đoạn 1", "Trạng thái tỉnh táo"], "Giai đoạn 1 là chuyển tiếp (alpha rồi theta), giai đoạn 2 có thoi ngủ và phức hợp K, giai đoạn 3 là sóng delta.", ["t-sleep-stages"]),
                  Q("\"Dung nạp\" (tolerance) đối với một chất tác động tâm thần nghĩa là gì?", "Cần liều cao hơn dần để đạt cùng một tác dụng", ["Cơ thể hoàn toàn hết nhu cầu với chất", "Chất không còn gây hại", "Chỉ xuất hiện khi ngừng chất đột ngột"], "Dung nạp phản ánh sự thích nghi của cơ thể; triệu chứng khi ngừng chất là hội chứng cai.", ["t-substance"]),
                  Q("Giấc ngủ liên quan thế nào tới trí nhớ?", "Giấc ngủ hỗ trợ hợp nhất (consolidation) ký ức mới", ["Giấc ngủ xóa các ký ức mới", "Giấc ngủ không ảnh hưởng gì tới trí nhớ", "Chỉ ký ức vận động chịu ảnh hưởng của giấc ngủ"], "Thiếu ngủ làm giảm khả năng học và nhớ vì quá trình hợp nhất bị gián đoạn.", ["t-consolidation", "t-sleep-stages"]),
                  Q("Phương pháp tâm lý nào có bằng chứng hiệu quả tốt và thường được ưu tiên đầu tiên cho mất ngủ mạn tính?", "Liệu pháp nhận thức hành vi cho mất ngủ (CBT-I)", ["Tăng liều caffeine ban ngày", "Nằm trên giường lâu hơn", "Chỉ dùng rượu trước khi ngủ"], "Giáo trình ghi nhận liệu pháp nhận thức hành vi có hiệu quả tốt với mất ngủ; các khuyến cáo lâm sàng hiện hành (ví dụ của Hội Bác sĩ Nội khoa Hoa Kỳ) xếp CBT-I là lựa chọn đầu tay. Rượu làm giấc ngủ kém chất lượng.", ["d-insomnia"])
                ]
              },
              {
                id: "l7", title: "Cảm giác và tri giác", minutes: 210,
                goals: ["Phân biệt cảm giác và tri giác", "Mô tả đường đi của thị giác và thính giác", "Áp dụng các nguyên lý Gestalt và tín hiệu chiều sâu"],
                read: [R(P2("5.1", 146), "Cảm giác và tri giác, ngưỡng"), R(P2("5.2", 149), "Sóng và bước sóng"), R(P2("5.3", 153), "Thị giác"), R(P2("5.4", 161), "Thính giác"), R(P2("5.5", 164), "Các giác quan khác"), R(P2("5.6", 168), "Gestalt"), R(NB("6.1", 240), "Hệ thị giác (nâng cao)", true)],
                study: ["t-sensation-perception", "t-thresholds", "t-vision", "t-hearing", "t-depth", "t-gestalt", "t-inattentional", "n-visual", "n-occipital", "n-temporal"],
                keys: ["Cảm giác là chuyển đổi năng lượng thành tín hiệu thần kinh; tri giác là diễn giải.", "Que nhạy ánh sáng yếu; nón cho màu và chi tiết.", "Ba màu (nón) và đối lập (sau võng mạc) cùng đúng ở các tầng khác nhau.", "Chú ý quyết định ta tri giác được gì (mù do không chú ý)."],
                pitfalls: ["Nghĩ rằng \"thấy\" là sao chép trung thực thế giới.", "Nhầm cao độ (tần số) với độ to (biên độ)."],
                practice: "Tri giác bị kỳ vọng ảnh hưởng, tương tự việc nhà lâm sàng có thể nghe thân chủ qua giả thuyết sẵn có.",
                quiz: [
                  Q("Quá trình nào là cảm giác (chứ chưa phải tri giác)?", "Thụ thể chuyển năng lượng kích thích thành tín hiệu thần kinh", ["Nhận ra khuôn mặt của một người quen thuộc", "Hiểu được nghĩa của một câu nói đã nghe", "Nhận ra một giai điệu đã từng nghe trước đó"], "Cảm giác là phát hiện và chuyển đổi kích thích; tri giác là tổ chức và diễn giải.", ["t-sensation-perception"]),
                  Q("Tế bào nón khác tế bào que ở điểm nào?", "Nón cho màu và chi tiết, tập trung ở hố trung tâm; que nhạy ánh sáng yếu", ["Nón nhạy ánh sáng yếu hơn tế bào que rất nhiều", "Que cho màu sắc còn nón thì chỉ cho thấy đen trắng", "Hai loại tế bào không khác gì nhau về chức năng"], "Que ưu thế ở ngoại vi võng mạc, hữu ích trong ánh sáng yếu.", ["t-vision"]),
                  Q("Hiện tượng hậu ảnh (nhìn lâu một màu rồi thấy màu đối lập) được giải thích bởi thuyết nào?", "Thuyết đối lập (opponent-process)", ["Thuyết ba màu một mình", "Thuyết Gestalt", "Thuyết hiệu ứng Flynn"], "Màu được mã hóa theo cặp đối lập (đỏ–lục, xanh–vàng, đen–trắng); thuyết ba màu giải thích ở tầng tế bào nón.", ["t-vision"]),
                  Q("Sau vài phút, bạn không còn ngửi thấy mùi nước hoa của chính mình. Hiện tượng này là gì?", "Thích nghi giác quan", ["Ngưỡng tuyệt đối", "Mù do không chú ý", "Điều kiện hóa cổ điển"], "Thích nghi giác quan: ngừng nhận biết kích thích không đổi.", ["t-thresholds"]),
                  Q("Ta thấy một vòng tròn dù nó được vẽ bằng các cung đứt đoạn. Nguyên lý Gestalt nào?", "Khép kín (closure)", ["Gần nhau", "Hình – nền", "Giống nhau"], "Não tự lấp chỗ trống để tạo hình hoàn chỉnh.", ["t-gestalt"]),
                  Q("Tín hiệu nào thuộc tín hiệu chiều sâu của hai mắt?", "Chênh lệch hai mắt (binocular disparity)", ["Phối cảnh tuyến tính", "Che khuất (interposition)", "Kích thước tương đối"], "Ba cái còn lại là tín hiệu một mắt, vì vậy người một mắt vẫn nhận chiều sâu.", ["t-depth"])
                ]
              }
            ]
          },
          {
            id: "m3", title: "Học tập, trí nhớ và nhận thức", month: "Tháng 3", lessons: [
              {
                id: "l8", title: "Học tập: điều kiện hóa cổ điển, thao tác và học qua quan sát", minutes: 210,
                goals: ["Gọi đúng tên CS, UCS, CR, UCR trong một ví dụ", "Phân biệt củng cố âm với trừng phạt", "Giải thích dập tắt, phục hồi tự phát và vì sao liệu pháp phơi nhiễm hiệu quả"],
                read: [R(P2("6.1", 181), "Học tập là gì"), R(P2("6.2", 183), "Điều kiện hóa cổ điển"), R(P2("6.3", 192), "Điều kiện hóa thao tác"), R(P2("6.4", 203), "Học qua quan sát")],
                study: ["t-classical", "t-extinction", "t-generalization", "t-higher-order", "t-operant", "t-reinforcement", "t-punishment", "t-schedules", "t-shaping", "t-observational", "t-latent-learning", "t-behavior-therapy", "t-exposure", "t-learned-helplessness", "t-safety-behavior"],
                keys: ["Cổ điển: ghép đôi kích thích; thao tác: hậu quả quyết định hành vi.", "Củng cố làm TĂNG hành vi (dương: thêm; âm: lấy bớt điều khó chịu); trừng phạt làm GIẢM.", "Củng cố từng phần, tỉ lệ biến thiên tạo hành vi bền nhất.", "Dập tắt không xóa hẳn học cũ, nên phục hồi tự phát có thể xảy ra."],
                pitfalls: ["Gọi củng cố âm là trừng phạt.", "Cho rằng lo âu hết là hết hẳn sau phơi nhiễm."],
                practice: "Đây là nền cho liệu pháp hành vi và phơi nhiễm; hành vi an toàn duy trì nỗi sợ vì nó ngăn việc học lại.",
                quiz: [
                  Q("Pavlov rung chuông (kích thích trung tính) rồi cho chó ăn nhiều lần. Về sau chỉ rung chuông chó cũng tiết nước dãi. Việc tiết nước dãi khi nghe chuông là gì?", "Phản ứng có điều kiện (CR)", ["Phản ứng vô điều kiện (UCR)", "Kích thích có điều kiện (CS)", "Kích thích vô điều kiện (UCS)"], "Chuông là CS, thức ăn là UCS; nước dãi khi chỉ có chuông là CR.", ["t-classical"]),
                  Q("Một người uống thuốc giảm đau, cơn đau mất, và lần sau lại uống thuốc sớm hơn. Cơ chế là gì?", "Củng cố âm", ["Trừng phạt dương", "Trừng phạt âm", "Dập tắt"], "Cơn đau (điều khó chịu) được lấy đi, nên hành vi uống thuốc tăng lên: đó là củng cố âm.", ["t-reinforcement"]),
                  Q("Lịch trình củng cố nào tạo hành vi bền và lặp lại mạnh nhất (như máy đánh bạc)?", "Tỉ lệ biến thiên", ["Củng cố liên tục", "Khoảng cố định", "Tỉ lệ cố định"], "Phần thưởng đến bất ngờ sau số lần không đoán trước khiến hành vi rất khó tắt.", ["t-schedules"]),
                  Q("Một người sau nhiều tuần phơi nhiễm không còn sợ, nhưng sau kỳ nghỉ hai tuần nỗi sợ bỗng quay lại. Thuật ngữ phù hợp?", "Phục hồi tự phát", ["Điều kiện hóa bậc cao", "Khái quát hóa kích thích", "Định hình hành vi"], "Dập tắt không xóa hẳn kết nối cũ, nên phản ứng đã tắt có thể xuất hiện lại sau khoảng nghỉ.", ["t-extinction"]),
                  Q("Trẻ nhìn người lớn đánh con búp bê rồi bắt chước. Đây là kiểu học nào?", "Học qua quan sát (mô hình hóa)", ["Điều kiện hóa cổ điển", "Học ngầm", "Điều kiện hóa thao tác thuần túy"], "Bandura cho thấy trẻ có thể học hành vi chỉ nhờ quan sát người khác.", ["t-observational"]),
                  Q("Cha mẹ tịch thu điện thoại của con vì con nói dối. Nếu mục tiêu là giảm nói dối, đây là gì?", "Trừng phạt âm", ["Trừng phạt dương", "Củng cố âm", "Củng cố dương"], "Trừng phạt âm lấy đi điều dễ chịu để giảm hành vi.", ["t-punishment"])
                ]
              },
              {
                id: "l9", title: "Trí nhớ: mã hóa, lưu trữ, truy xuất và những lỗi của trí nhớ", minutes: 210,
                goals: ["Mô tả ba hệ trí nhớ và các loại trí nhớ dài hạn", "Giải thích quên, giao thoa và ký ức sai", "Áp dụng chiến lược học dựa trên bằng chứng"],
                read: [R(P2("8.1", 248), "Trí nhớ hoạt động thế nào"), R(P2("8.2", 255), "Các vùng não"), R(P2("8.3", 259), "Các vấn đề của trí nhớ"), R(P2("8.4", 269), "Cách tăng cường trí nhớ"), R(NB("18.1", 790), "Phân loại trí nhớ (nâng cao)", true), R(NB("18.4", 815), "Cơ chế synapse của trí nhớ dài hạn (nâng cao)", true)],
                study: ["t-atkinson", "t-working-memory", "t-chunking", "t-levels-processing", "t-ltm", "t-episodic-semantic", "t-amnesia", "t-memory-errors", "t-false-memory", "t-interference", "t-retrieval", "t-mnemonic", "t-consolidation", "t-reconsolidation", "t-flashbulb", "n-hippocampus", "n-ltp"],
                keys: ["Giác quan → ngắn hạn/làm việc → dài hạn; mã hóa, lưu trữ, truy xuất.", "Tự kiểm tra bằng truy hồi chủ động hiệu quả hơn đọc lại.", "Trí nhớ mang tính tái tạo, nên ký ức có thể sai dù người nhớ rất chắc chắn.", "Hồi hải mã đặc biệt quan trọng với ký ức sự kiện mới."],
                pitfalls: ["Tin rằng trí nhớ là bản ghi hình trung thực.", "Dùng câu hỏi dẫn dắt khi phỏng vấn lâm sàng."],
                practice: "Trong phỏng vấn, câu hỏi mở và trung tính giảm nguy cơ làm biến dạng ký ức của thân chủ; chính bạn cũng nên học bằng truy hồi chủ động và lặp lại ngắt quãng.",
                quiz: [
                  Q("Thứ tự các hệ trí nhớ trong mô hình Atkinson–Shiffrin là gì?", "Trí nhớ giác quan → ngắn hạn/làm việc → dài hạn", ["Dài hạn → giác quan → ngắn hạn", "Ngắn hạn → giác quan → dài hạn", "Giác quan → dài hạn → ngắn hạn"], "Thông tin được chú ý mới chuyển từ giác quan sang ngắn hạn; được mã hóa tốt mới vào dài hạn.", ["t-atkinson"]),
                  Q("Gom số điện thoại 0903123456 thành các cụm 0903 – 123 – 456 để dễ nhớ là kỹ thuật gì?", "Gom nhóm (chunking)", ["Giao thoa chủ động", "Học lại (relearning)", "Hợp nhất lại (reconsolidation)"], "Gom nhóm tổ chức thông tin thành cụm có nghĩa để vượt giới hạn dung lượng ngắn hạn.", ["t-chunking"]),
                  Q("Sau chấn thương sọ não, một người không thể hình thành ký ức mới nhưng vẫn nhớ tuổi thơ. Hiện tượng này gọi là gì?", "Mất trí nhớ thuận chiều", ["Mất trí nhớ nghịch chiều", "Giao thoa hồi ức", "Ký ức chớp sáng"], "Thuận chiều: không tạo ký ức mới sau tổn thương; nghịch chiều: mất ký ức trước tổn thương.", ["t-amnesia"]),
                  Q("Bạn đổi số điện thoại nhưng vẫn quay số cũ theo thói quen. Đây là gì?", "Giao thoa chủ động", ["Giao thoa hồi tố", "Mất trí nhớ thuận chiều", "Ký ức chớp sáng"], "Giao thoa chủ động: cái cũ cản trở cái mới; giao thoa hồi tố ngược lại.", ["t-interference"]),
                  Q("Hiệu ứng thông tin sai lệch (misinformation effect) cho thấy điều gì?", "Câu hỏi dẫn dắt hoặc thông tin sai sau sự kiện có thể làm biến đổi ký ức", ["Ký ức luôn chính xác nếu người nhớ chắc chắn", "Chỉ trẻ em mới bị ảnh hưởng", "Ký ức sang chấn không bao giờ bị thay đổi"], "Độ tự tin cao không đảm bảo chính xác; vì vậy nhà lâm sàng cần đặt câu hỏi mở, trung tính.", ["t-false-memory"]),
                  Q("Chiến lược học nào được bằng chứng ủng hộ mạnh hơn đọc lại ghi chú nhiều lần?", "Tự kiểm tra bằng truy hồi chủ động, lặp lại ngắt quãng", ["Đọc lại ghi chú bằng giọng to hơn nhiều lần", "Học dồn trong một đêm ngay trước kỳ thi", "Gạch chân thật nhiều màu trong tài liệu học"], "Truy hồi chủ động củng cố đường truy xuất; lặp ngắt quãng làm ký ức bền hơn.", ["t-retrieval", "t-mnemonic"]),
                  Q("Mô tả nào đúng về trí nhớ thủ tục (procedural)?", "Là trí nhớ ngầm về kỹ năng và thói quen, như đi xe đạp", ["Là ký ức về sự kiện cá nhân", "Là kiến thức về sự kiện thế giới", "Là dung lượng ngắn hạn 7 mục"], "Sự kiện cá nhân là episodic, kiến thức khái niệm là semantic; cả hai thuộc nhóm tường minh.", ["t-episodic-semantic"])
                ]
              },
              {
                id: "l10", title: "Tư duy, ngôn ngữ và trí thông minh", minutes: 210,
                goals: ["Nhận ra các lối tắt nhận thức và thiên kiến", "Phân biệt các thành phần của ngôn ngữ", "Giải thích chuẩn hóa, độ lệch chuẩn và các lý thuyết trí thông minh"],
                read: [R(P2("7.1", 214), "Nhận thức là gì"), R(P2("7.2", 218), "Ngôn ngữ"), R(P2("7.3", 222), "Giải quyết vấn đề"), R(P2("7.4", 228), "Trí thông minh và sáng tạo"), R(P2("7.5", 231), "Đo trí thông minh"), R(P2("7.6", 237), "Nguồn gốc của trí thông minh")],
                study: ["t-concepts", "t-language", "t-heuristics", "t-functional-fixedness", "t-confirmation", "t-schema", "t-metacognition", "t-intelligence", "t-emotional-intelligence", "t-testing", "t-learning-disabilities", "n-broca", "n-wernicke"],
                keys: ["Lối tắt tư duy (heuristic) tiết kiệm sức nhưng dễ sai.", "Ngôn ngữ gồm âm vị, hình vị, cú pháp và ngữ nghĩa.", "IQ chuẩn hóa có trung bình 100 và độ lệch chuẩn 15.", "Trí thông minh có nhiều lý thuyết; trí tuệ dịch thể khác kết tinh."],
                pitfalls: ["Xem điểm IQ như một con số cố định, tuyệt đối.", "Bỏ qua yếu tố văn hóa khi dùng trắc nghiệm."],
                practice: "Hiểu thiên kiến nhận thức giúp bạn tự kiểm tra suy luận lâm sàng của chính mình, nhất là thiên kiến xác nhận.",
                quiz: [
                  Q("Sau khi xem tin tai nạn máy bay, một người đánh giá việc đi máy bay nguy hiểm hơn thực tế vì ví dụ đó dễ nhớ. Đây là lối tắt nào?", "Heuristic sẵn có (availability)", ["Heuristic neo (anchoring)", "Cố định chức năng", "Thiên kiến nhìn lại"], "Ta đánh giá xác suất theo mức dễ nhớ ví dụ, nên các sự kiện gây ấn tượng bị đánh giá quá cao.", ["t-heuristics"]),
                  Q("Giải một câu đố hoàn toàn mới, chưa từng gặp, chủ yếu cần loại trí tuệ nào?", "Trí tuệ dịch thể (fluid)", ["Trí tuệ kết tinh (crystallized)", "Trí tuệ vận động", "Trí tuệ cảm xúc thuần túy"], "Trí tuệ dịch thể xử lý vấn đề mới; kết tinh là kiến thức đã tích lũy.", ["t-intelligence"]),
                  Q("Một người chỉ nghĩ búa dùng để đóng đinh nên không nghĩ ra việc dùng búa làm vật chặn cửa. Hiện tượng này là gì?", "Cố định chức năng", ["Heuristic đại diện", "Thiên kiến xác nhận", "Hiệu ứng Flynn"], "Cố định chức năng cản trở việc thấy công dụng mới của một vật.", ["t-functional-fixedness"]),
                  Q("Với IQ chuẩn hóa có trung bình 100 và độ lệch chuẩn 15, điểm 115 nằm ở đâu?", "Cao hơn trung bình một độ lệch chuẩn", ["Thấp hơn trung bình một độ lệch chuẩn", "Ngay tại trung bình", "Cao hơn trung bình hai độ lệch chuẩn"], "115 = 100 + 15, tức +1 SD; 70 là −2 SD.", ["t-testing"]),
                  Q("Hiệu ứng Flynn cho thấy điều gì và hệ quả là gì?", "Điểm IQ trung bình tăng qua các thế hệ nên chuẩn mẫu phải được cập nhật", ["IQ giảm qua các thế hệ nên cần hạ ngưỡng", "IQ hoàn toàn di truyền", "IQ không đo được"], "Do đó điểm cũ so với chuẩn mẫu cũ không còn tương đương với điểm mới.", ["t-testing"]),
                  Q("Đơn vị nhỏ nhất mang nghĩa trong ngôn ngữ là gì?", "Hình vị (morpheme)", ["Âm vị (phoneme)", "Cú pháp", "Âm tiết bất kỳ"], "Âm vị là đơn vị âm nhỏ nhất, chưa mang nghĩa; hình vị là đơn vị nghĩa nhỏ nhất.", ["t-language"]),
                  Q("Sternberg đề xuất trí thông minh gồm ba thành tố nào?", "Phân tích, sáng tạo, thực hành", ["Logic, âm nhạc, thể chất", "Dịch thể, kết tinh, cảm xúc", "Ngôn ngữ, toán học, không gian"], "Gardner đề xuất nhiều loại trí tuệ; Sternberg đề xuất ba thành tố.", ["t-intelligence"])
                ]
              }
            ]
          }
        ]
      },
      { id: "s2", title: "Giai đoạn 2 · Phát triển, động cơ, cảm xúc và nhân cách", months: "Tháng 4–5 (11/2026 – 12/2026)", ready: false, goal: "Phát triển suốt đời, gắn bó, động cơ, cảm xúc và các thuyết nhân cách.", modules: [] },
      { id: "s3", title: "Giai đoạn 3 · Tâm lý xã hội, sức khỏe và tâm bệnh học", months: "Tháng 6–7 (1/2027 – 2/2027)", ready: false, goal: "Ảnh hưởng xã hội, stress, chẩn đoán DSM-5-TR/ICD-11 và các nhóm rối loạn.", modules: [] },
      { id: "s4", title: "Giai đoạn 4 · Tư vấn và trị liệu", months: "Tháng 8 (3/2027 – 4/2027)", ready: false, goal: "Các trường phái trị liệu, kỹ năng tham vấn cơ bản và đạo đức nghề.", modules: [] }
    ]
  };
})();
